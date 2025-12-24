// process-image.js
import { PassThrough } from 'stream';
import sharp from 'sharp';
import archiver from 'archiver';
import middy from '@middy/core';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

const CONFIG = {
  MAX_WORKERS: 4, // Adjust based on Netlify's environment
  JPEG_QUALITY: 95,
  PNG_COMPRESSION: 6,
  WEBP_QUALITY: 90,
  MAX_IMAGE_DIMENSION: 8000,
  SIZES: {
    t: [100, 100],
    s: [300, 300],
    m: [500, 500],
    l: [800, 800],
    xl: [1000, 1000],
    xxl: [1200, 1200],
  },
};

class ImageProcessor {
  constructor() {
    this.srgbProfile = 'srgb';
  }

  async validateImage(buffer) {
    try {
      await sharp(buffer).metadata();
      return true;
    } catch (err) {
      console.error('Validation failed:', err);
      return false;
    }
  }

  async processImage(buffer, format) {
    try {
      let image = sharp(buffer);
      const metadata = await image.metadata();

      if (
        metadata.width > CONFIG.MAX_IMAGE_DIMENSION ||
        metadata.height > CONFIG.MAX_IMAGE_DIMENSION
      ) {
        throw new Error(
          `Image dimensions exceed maximum allowed size of ${CONFIG.MAX_IMAGE_DIMENSION}px`,
        );
      }

      image = image.toColorspace(this.srgbProfile);
      if (format === 'png' || format === 'webp') {
        image = image.ensureAlpha();
      } else if (format === 'jpeg') {
        image = image.flatten({ background: { r: 255, g: 255, b: 255 } });
      }

      return image;
    } catch (error) {
      console.error('Error during processing:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async resizeAndOptimize(image, size, format) {
    const [width, height] = size;
    const options = {
      jpeg: { quality: CONFIG.JPEG_QUALITY, progressive: true },
      png: { compressionLevel: CONFIG.PNG_COMPRESSION },
      webp: { quality: CONFIG.WEBP_QUALITY },
    };

    return image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .toFormat(format, options[format] || {});
  }
}

const processImages = async (event) => {
  console.log('Received event:', {
    headers: event.headers,
    bodyKeys: Object.keys(event.body || {}),
  });
  try {
    if (!event.body || !event.body.images) {
      console.error('No images provided in the request.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No images provided' }),
      };
    }

    const images = Array.isArray(event.body.images)
      ? event.body.images
      : [event.body.images];
    console.log(`Processing ${images.length} image(s).`);

    const exportType = (event.body['Export-Type'] || 'webp').toLowerCase();
    const validFormats = ['png', 'webp', 'jpeg'];
    if (!validFormats.includes(exportType)) {
      console.error('Invalid export type:', exportType);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid export type. Use "png", "webp", or "jpeg"',
        }),
      };
    }

    const processor = new ImageProcessor();
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = new PassThrough();
    archive.pipe(output);

    const processImagePromises = images.map(async (imageFile) => {
      const buffer = Buffer.from(imageFile.content, 'binary');
      if (!(await processor.validateImage(buffer))) {
        throw new Error(`Invalid image: ${imageFile.filename}`);
      }

      const image = await processor.processImage(buffer, exportType);
      const filename = imageFile.filename.split('.')[0];

      await Promise.all(
        Object.entries(CONFIG.SIZES).map(async ([sizeName, size]) => {
          const resizedImage = await processor.resizeAndOptimize(
            image.clone(),
            size,
            exportType,
          );
          const outputBuffer = await resizedImage.toBuffer();
          const filepath = `${filename}/${sizeName}.${exportType}`;
          archive.append(outputBuffer, { name: filepath });
        }),
      );
    });

    await Promise.all(processImagePromises);
    await archive.finalize();

    // Collect the zip output
    const chunks = [];
    for await (const chunk of output) {
      chunks.push(chunk);
    }
    const zipBuffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="processed_images.zip"',
      },
      isBase64Encoded: true,
      body: zipBuffer.toString('base64'),
    };
  } catch (error) {
    console.error('Error in processImages:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const handler = middy(processImages)
  .use(httpMultipartBodyParser())
  .use(
    cors({
      origin: ['http://localhost:8888', 'http://localhost:1234'],
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type',
    }),
  )
  .use(httpErrorHandler());
