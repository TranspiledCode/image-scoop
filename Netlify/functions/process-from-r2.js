import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import archiver from 'archiver';

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
          `Image dimensions exceed maximum of ${CONFIG.MAX_IMAGE_DIMENSION}px`,
        );
      }

      image = image.rotate();

      if (metadata.space && metadata.space !== 'srgb') {
        image = image.toColorspace(this.srgbProfile);
      }

      const results = {};
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
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: 'application/zip',
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
    }
  });

  await Promise.all(deletePromises);
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { batchId, files, format } = JSON.parse(event.body);

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

    for (const file of processedFiles) {
      const baseName = file.originalName.replace(/\.[^/.]+$/, '');

      for (const [sizeName, buffer] of Object.entries(file.sizes)) {
        const filename = `${baseName}_${sizeName}.${format}`;
        archive.append(buffer, { name: filename });
      }
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
      }),
    };
  } catch (error) {
    console.error('Processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Processing failed',
        message: error.message,
      }),
    };
  }
};
