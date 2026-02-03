// process-image.js
import { PassThrough } from 'stream';
import sharp from 'sharp';
import archiver from 'archiver';
import middy from '@middy/core';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import {
  MAX_FILES_PER_BATCH,
  PER_FILE_LIMIT_BYTES,
  TOTAL_BATCH_LIMIT_BYTES,
  humanFileSize,
} from '../../src/shared/uploadLimits.js';
import { initSentry, captureError, setTag } from './utils/sentry.js';

const CONFIG = {
  MAX_WORKERS: 4, // Adjust based on Netlify's environment
  JPEG_QUALITY: 95,
  PNG_COMPRESSION: 6,
  WEBP_QUALITY: 90,
  AVIF_QUALITY: 85,
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
      captureError(err, {
        tags: { operation: 'validate_image' },
        extra: { bufferSize: buffer.length },
      });
      return false;
    }
  }

  async processImage(buffer, format) {
    let metadata;
    try {
      let image = sharp(buffer);
      metadata = await image.metadata();

      if (
        metadata.width > CONFIG.MAX_IMAGE_DIMENSION ||
        metadata.height > CONFIG.MAX_IMAGE_DIMENSION
      ) {
        throw new Error(
          `Image dimensions exceed maximum allowed size of ${CONFIG.MAX_IMAGE_DIMENSION}px`,
        );
      }

      image = image.toColorspace(this.srgbProfile);
      if (format === 'png' || format === 'webp' || format === 'avif') {
        image = image.ensureAlpha();
      } else if (format === 'jpeg') {
        image = image.flatten({ background: { r: 255, g: 255, b: 255 } });
      }

      return image;
    } catch (error) {
      console.error('Error during processing:', error);
      captureError(error, {
        tags: { operation: 'process_image', format },
        extra: { metadataAvailable: !!metadata },
      });
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async resizeAndOptimize(image, size, format) {
    const [width, height] = size;
    const options = {
      jpeg: { quality: CONFIG.JPEG_QUALITY, progressive: true },
      png: { compressionLevel: CONFIG.PNG_COMPRESSION },
      webp: { quality: CONFIG.WEBP_QUALITY },
      avif: { quality: CONFIG.AVIF_QUALITY },
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
  // Initialize Sentry for error tracking
  initSentry('process-image');

  console.warn('Received event:', {
    headers: event.headers,
    bodyKeys: Object.keys(event.body || {}),
  });

  let images;
  let totalBytes = 0;

  try {
    if (!event.body || !event.body.images) {
      console.error('No images provided in the request.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No images provided' }),
      };
    }

    images = Array.isArray(event.body.images)
      ? event.body.images
      : [event.body.images];
    console.warn(`Processing ${images.length} image(s).`);

    if (images.length > MAX_FILES_PER_BATCH) {
      const message = `You can upload up to ${MAX_FILES_PER_BATCH} files per batch.`;
      console.error(message);
      return {
        statusCode: 413,
        body: JSON.stringify({ error: message, code: 'too_many_files' }),
      };
    }

    const parsedImages = images.map((imageFile) => {
      const buffer = Buffer.isBuffer(imageFile.content)
        ? imageFile.content
        : Buffer.from(imageFile.content, 'binary');
      const fileSizeBytes = buffer.length;

      if (fileSizeBytes > PER_FILE_LIMIT_BYTES) {
        const message = `${imageFile.filename} exceeds the per-file limit of ${humanFileSize(
          PER_FILE_LIMIT_BYTES,
        )}.`;
        console.error(message);
        throw Object.assign(new Error(message), {
          statusCode: 413,
          code: 'file_too_large',
        });
      }

      totalBytes += fileSizeBytes;

      if (totalBytes > TOTAL_BATCH_LIMIT_BYTES) {
        const message = `Total upload size exceeds ${humanFileSize(TOTAL_BATCH_LIMIT_BYTES)}.`;
        console.error(message);
        throw Object.assign(new Error(message), {
          statusCode: 413,
          code: 'batch_too_large',
        });
      }

      return {
        buffer,
        original: imageFile,
        fileSizeBytes,
      };
    });

    const exportType = (event.body['Export-Type'] || 'webp').toLowerCase();
    const validFormats = ['png', 'webp', 'jpeg', 'avif'];
    if (!validFormats.includes(exportType)) {
      console.error('Invalid export type:', exportType);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid export type. Use "png", "webp", "jpeg", or "avif"',
        }),
      };
    }

    // Set Sentry tags for this processing batch
    setTag('exportType', exportType);
    setTag('batchSize', images.length.toString());
    setTag('totalBytes', totalBytes.toString());

    const processor = new ImageProcessor();
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = new PassThrough();
    archive.pipe(output);

    const processImagePromises = parsedImages.map(async ({ original, buffer }) => {
      if (!(await processor.validateImage(buffer))) {
        throw new Error(`Invalid image: ${original.filename}`);
      }

      const image = await processor.processImage(buffer, exportType);
      const filename = original.filename.split('.')[0];

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
    console.error('Error in processImages:', error.stack || error);
    const statusCode = error.statusCode || 500;

    // Capture error in Sentry with context
    captureError(error, {
      tags: {
        operation: 'batch_process',
        statusCode: statusCode.toString(),
        errorCode: error.code || 'server_error',
      },
      extra: {
        imageCount: images?.length,
        totalBytes,
      },
    });

    return {
      statusCode,
      body: JSON.stringify({ error: error.message, code: error.code || 'server_error' }),
    };
  }
};

export const handler = middy(processImages)
  .use(httpMultipartBodyParser())
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8888',
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type',
    }),
  )
  .use(httpErrorHandler());
