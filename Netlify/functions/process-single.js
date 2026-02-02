// process-single.js - Single image processor for demo with all size variants
import sharp from 'sharp';
import archiver from 'archiver';
import middy from '@middy/core';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import { initSentry, captureError, setTag } from './utils/sentry.js';

const CONFIG = {
  JPEG_QUALITY: 95,
  PNG_COMPRESSION: 6,
  WEBP_QUALITY: 90,
  MAX_IMAGE_DIMENSION: 8000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for demo
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
      if (format === 'png' || format === 'webp') {
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
      png: { 
        compressionLevel: CONFIG.PNG_COMPRESSION,
        adaptiveFiltering: true,
        palette: false
      },
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

const processSingleImage = async (event) => {
  // Initialize Sentry for error tracking
  initSentry('process-single');

  console.warn('Received single image processing request');
  try {
    if (!event.body || !event.body.file) {
      console.error('No file provided in the request.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' }),
      };
    }

    const file = event.body.file;
    const buffer = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(file.content, 'binary');

    if (buffer.length > CONFIG.MAX_FILE_SIZE) {
      return {
        statusCode: 413,
        body: JSON.stringify({ error: 'File size exceeds 5MB limit for demo' }),
      };
    }

    const format = (event.headers['x-output-format'] || 'webp').toLowerCase();
    console.warn('Processing with format:', format);

    const validFormats = ['png', 'webp', 'jpeg'];
    if (!validFormats.includes(format)) {
      console.error('Invalid format received:', format);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid format. Use "png", "webp", or "jpeg"',
        }),
      };
    }

    // Set Sentry tags for this processing request
    setTag('format', format);
    setTag('variantCount', Object.keys(CONFIG.SIZES).length.toString());

    const processor = new ImageProcessor();

    if (!(await processor.validateImage(buffer))) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid image file' }),
      };
    }

    const image = await processor.processImage(buffer, format);
    console.warn('Image processed successfully, creating variants...');
    
    // Use custom filename from header if provided, otherwise use original filename
    const customFilename = event.headers['x-custom-filename'];
    const filename = customFilename || (file.filename ? file.filename.split('.')[0] : 'optimized');

    // Create ZIP archive with all size variants
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks = [];
    
    // Collect chunks as they're written
    archive.on('data', (chunk) => chunks.push(chunk));

    // Generate all size variants
    try {
      await Promise.all(
        Object.entries(CONFIG.SIZES).map(async ([sizeName, size]) => {
          console.warn(`Processing ${sizeName} variant for ${format}...`);
          const resizedImage = await processor.resizeAndOptimize(
            image.clone(),
            size,
            format,
          );
          const outputBuffer = await resizedImage.toBuffer();
          const filepath = `${filename}/${sizeName}.${format}`;
          archive.append(outputBuffer, { name: filepath });
          console.warn(`Completed ${sizeName} variant`);
        }),
      );
    } catch (variantError) {
      console.error('Error creating variants:', variantError);
      captureError(variantError, {
        tags: { operation: 'create_variants', format },
        extra: { totalVariants: Object.keys(CONFIG.SIZES).length },
      });
      throw new Error(`Failed to create image variants: ${variantError.message}`);
    }

    console.warn('Finalizing archive...');
    
    // Wait for archive to finish
    await new Promise((resolve, reject) => {
      archive.on('end', resolve);
      archive.on('error', reject);
      archive.finalize();
    });
    
    console.warn('Archive finalized, creating buffer...');
    const zipBuffer = Buffer.concat(chunks);
    console.warn('ZIP buffer created, size:', zipBuffer.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}.zip"`,
      },
      isBase64Encoded: true,
      body: zipBuffer.toString('base64'),
    };
  } catch (error) {
    console.error('Error in processSingleImage:', error.stack || error);

    // Capture error in Sentry with context
    captureError(error, {
      tags: {
        operation: 'process_single',
        errorType: error.name,
      },
      extra: {
        errorMessage: error.message,
      },
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const handler = middy(processSingleImage)
  .use(httpMultipartBodyParser())
  .use(
    cors({
      origin: '*',
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type,X-Output-Format,X-Custom-Filename',
    }),
  )
  .use(httpErrorHandler());
