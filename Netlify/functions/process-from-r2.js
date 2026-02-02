import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import archiver from 'archiver';
import { initSentry, captureError, setTag } from './utils/sentry.js';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const CONFIG = {
  MAX_WORKERS: 4,
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
      captureError(err, {
        tags: { operation: 'validate_image' },
        extra: { bufferSize: buffer.length },
      });
      return false;
    }
  }

  async processImage(buffer, format) {
    const results = {};
    try {
      let image = sharp(buffer);
      const metadata = await image.metadata();

      if (
        metadata.width > CONFIG.MAX_IMAGE_DIMENSION ||
        metadata.height > CONFIG.MAX_IMAGE_DIMENSION
      ) {
        throw new Error(
          `Image dimensions exceed maximum of ${CONFIG.MAX_IMAGE_DIMENSION}px`,
        );
      }

      image = image.rotate();

      if (metadata.space && metadata.space !== 'srgb') {
        image = image.toColorspace(this.srgbProfile);
      }

      for (const [sizeName, [width, height]] of Object.entries(CONFIG.SIZES)) {
        const resized = image.clone().resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });

        let processed;
        if (format === 'jpeg') {
          processed = await resized
            .jpeg({ quality: CONFIG.JPEG_QUALITY })
            .toBuffer();
        } else if (format === 'png') {
          processed = await resized
            .png({ compressionLevel: CONFIG.PNG_COMPRESSION })
            .toBuffer();
        } else if (format === 'webp') {
          processed = await resized
            .webp({ quality: CONFIG.WEBP_QUALITY })
            .toBuffer();
        } else {
          throw new Error(`Unsupported format: ${format}`);
        }

        results[sizeName] = processed;
      }

      return results;
    } catch (err) {
      console.error('Processing error:', err);
      captureError(err, {
        tags: { operation: 'process_image', format },
        extra: { sizesProcessed: Object.keys(results).length },
      });
      throw err;
    }
  }
}

async function getFileFromR2(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  const chunks = [];

  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function uploadZipToR2(batchId, zipBuffer) {
  const zipKey = `processed/${batchId}.zip`;
  
  // Create timestamp for filename (YYYYMMDD-HHMM format)
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `ImageScoop-${timestamp}.zip`;
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: 'application/zip',
      ContentDisposition: `attachment; filename="${filename}"`,
    }),
  );

  const downloadUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: zipKey,
    }),
    { expiresIn: 3600 },
  );

  return { downloadUrl };
}

const cleanupUploadedFiles = async (files) => {
  const deletePromises = files.map(async (file) => {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: file.key,
        }),
      );
    } catch (error) {
      console.error(`Failed to delete ${file.key}:`, error);
      captureError(error, {
        tags: { operation: 'cleanup_r2' },
        extra: { fileKey: file.key },
      });
    }
  });

  await Promise.all(deletePromises);
};

export const handler = async (event) => {
  // Initialize Sentry for error tracking
  initSentry('process-from-r2');

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const startTime = Date.now();

  try {
    const { batchId, files, format, omitFilename = false } = JSON.parse(event.body);

    // Set Sentry tags for this processing batch
    setTag('format', format);
    setTag('fileCount', files?.length?.toString() || '0');
    setTag('operation', 'process_from_r2');

    if (!batchId || !files || !Array.isArray(files) || files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'batchId and files array are required',
        }),
      };
    }

    if (!['jpeg', 'png', 'webp'].includes(format)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid format' }),
      };
    }

    const processor = new ImageProcessor();
    const processedFiles = [];

    for (const file of files) {
      const { key, originalName } = file;

      console.warn(`Processing ${originalName} from R2...`);

      const buffer = await getFileFromR2(key);

      const isValid = await processor.validateImage(buffer);
      if (!isValid) {
        throw new Error(`Invalid image: ${originalName}`);
      }

      const processed = await processor.processImage(buffer, format);

      processedFiles.push({
        originalName,
        sizes: processed,
      });
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks = [];

    archive.on('data', (chunk) => chunks.push(chunk));

    const archivePromise = new Promise((resolve, reject) => {
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);
    });

    // Calculate total size of largest variants only (for compression savings metric)
    let totalProcessedSize = 0;
    
    for (const file of processedFiles) {
      const baseName = file.originalName.replace(/\.[^/.]+$/, '');

      // Find the largest variant (typically xxl)
      let largestSize = 0;
      for (const [sizeName, buffer] of Object.entries(file.sizes)) {
        if (buffer.length > largestSize) {
          largestSize = buffer.length;
        }
        
        // Conditionally include or omit filename based on option
        const filename = omitFilename
          ? `${sizeName}.${format}`
          : `${baseName}_${sizeName}.${format}`;
        // Organize files into folders by original filename
        const folderPath = `${baseName}/${filename}`;
        archive.append(buffer, { name: folderPath });
      }
      
      totalProcessedSize += largestSize;
    }

    archive.finalize();

    const zipBuffer = await archivePromise;

    const { downloadUrl } = await uploadZipToR2(batchId, zipBuffer);

    // Clean up uploaded files from R2 after successful processing
    await cleanupUploadedFiles(files);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        downloadUrl,
        filesProcessed: processedFiles.length,
        size: totalProcessedSize,
      }),
    };
  } catch (error) {
    console.error('Processing error:', error);

    const processingTime = Date.now() - startTime;

    // Capture error in Sentry with context
    captureError(error, {
      tags: {
        operation: 'process_from_r2',
        errorType: error.name,
      },
      extra: {
        processingTimeMs: processingTime,
        errorMessage: error.message,
      },
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Processing failed',
        message: error.message,
      }),
    };
  }
};
