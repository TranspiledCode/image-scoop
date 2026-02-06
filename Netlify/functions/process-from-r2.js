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

  async processImage(buffer, format, advancedOptions = {}) {
    const results = {};
    try {
      let image = sharp(buffer);
      const metadata = await image.metadata();

      // Use maxDimension from advanced options or default
      const maxDimension = advancedOptions.maxDimension || CONFIG.MAX_IMAGE_DIMENSION;

      if (
        metadata.width > maxDimension ||
        metadata.height > maxDimension
      ) {
        throw new Error(
          `Image dimensions exceed maximum of ${maxDimension}px`,
        );
      }

      image = image.rotate();

      // Apply color space conversion
      const colorSpace = advancedOptions.colorSpace || 'srgb';
      if (colorSpace === 'srgb' && metadata.space && metadata.space !== 'srgb') {
        image = image.toColorspace(this.srgbProfile);
      } else if (colorSpace === 'linear' && metadata.space !== 'linear') {
        image = image.toColorspace('linear');
      }
      // 'original' colorSpace means skip conversion

      // Apply metadata stripping if requested
      if (advancedOptions.stripMetadata) {
        image = image.withMetadata({});
      }

      // Apply sharpening if requested
      const sharpening = advancedOptions.sharpening || 'none';
      if (sharpening !== 'none') {
        const sharpeningPresets = {
          light: [0.5, 1.0, 2.0],
          medium: [1.0, 1.5, 2.5],
          strong: [2.0, 2.0, 3.0],
        };
        const [sigma, flat, jagged] = sharpeningPresets[sharpening] || [1.0, 1.5, 2.5];
        image = image.sharpen(sigma, flat, jagged);
      }

      // Filter sizes based on selectedVariants
      const selectedVariants = advancedOptions.selectedVariants || ['t', 's', 'm', 'l', 'xl', 'xxl'];
      const activeSizes = Object.fromEntries(
        Object.entries(CONFIG.SIZES).filter(([key]) =>
          selectedVariants.includes(key)
        )
      );

      // Get resize algorithm (kernel)
      const resizeAlgorithm = advancedOptions.resizeAlgorithm || 'lanczos3';
      const kernelMap = {
        lanczos3: sharp.kernel.lanczos3,
        lanczos2: sharp.kernel.lanczos2,
        cubic: sharp.kernel.cubic,
        mitchell: sharp.kernel.mitchell,
        nearest: sharp.kernel.nearest,
      };
      const kernel = kernelMap[resizeAlgorithm] || sharp.kernel.lanczos3;

      // Get aspect ratio setting
      const aspectRatio = advancedOptions.aspectRatio || 'original';

      for (const [sizeName, [width, height]] of Object.entries(activeSizes)) {
        let resizedWidth = width;
        let resizedHeight = height;
        let resizeFit = 'inside'; // Default: preserve aspect ratio

        // Calculate target dimensions based on aspect ratio
        if (aspectRatio !== 'original') {
          // Parse aspect ratio (e.g., "1:1", "16:9", "4:3")
          const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);

          if (widthRatio && heightRatio) {
            // Use 'cover' to crop to exact aspect ratio
            resizeFit = 'cover';

            // Calculate dimensions maintaining the specified aspect ratio
            if (widthRatio === heightRatio) {
              // Square: use max dimension for both
              resizedWidth = width;
              resizedHeight = height;
            } else if (widthRatio > heightRatio) {
              // Landscape: width is max dimension
              resizedWidth = width;
              resizedHeight = Math.round(width * (heightRatio / widthRatio));
            } else {
              // Portrait: height is max dimension
              resizedHeight = height;
              resizedWidth = Math.round(height * (widthRatio / heightRatio));
            }
          }
        }

        const resized = image.clone().resize(resizedWidth, resizedHeight, {
          fit: resizeFit,
          withoutEnlargement: true,
          kernel,
        });

        let processed;
        if (format === 'jpeg') {
          const jpegQuality = advancedOptions.jpegQuality || CONFIG.JPEG_QUALITY;
          const progressiveJpeg = advancedOptions.progressiveJpeg !== false;
          const chromaSubsampling = advancedOptions.chromaSubsampling || '4:2:0';

          processed = await resized
            .jpeg({
              quality: jpegQuality,
              progressive: progressiveJpeg,
              chromaSubsampling,
            })
            .toBuffer();
        } else if (format === 'png') {
          const pngCompression = advancedOptions.pngCompression !== undefined
            ? advancedOptions.pngCompression
            : CONFIG.PNG_COMPRESSION;

          processed = await resized
            .png({ compressionLevel: pngCompression })
            .toBuffer();
        } else if (format === 'webp') {
          const webpQuality = advancedOptions.webpQuality || CONFIG.WEBP_QUALITY;

          processed = await resized
            .webp({ quality: webpQuality })
            .toBuffer();
        } else if (format === 'avif') {
          const avifQuality = advancedOptions.avifQuality || CONFIG.AVIF_QUALITY;

          processed = await resized
            .avif({ quality: avifQuality })
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
    const { batchId, files, format, advancedOptions = {} } = JSON.parse(event.body);

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

    if (!['jpeg', 'png', 'webp', 'avif'].includes(format)) {
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

      const processed = await processor.processImage(buffer, format, advancedOptions);

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

    // Get naming and organization options
    const omitFilename = advancedOptions.omitFilename !== false; // default true
    const filenamePrefix = advancedOptions.filenamePrefix || '';
    const filenameSuffix = advancedOptions.filenameSuffix || '';
    const folderOrganization = advancedOptions.folderOrganization || 'by-original';

    for (const file of processedFiles) {
      const baseName = file.originalName.replace(/\.[^/.]+$/, '');

      // Apply prefix/suffix to base name for filename generation
      const processedName = `${filenamePrefix}${baseName}${filenameSuffix}`;

      // Find the largest variant (typically xxl)
      let largestSize = 0;
      for (const [sizeName, buffer] of Object.entries(file.sizes)) {
        if (buffer.length > largestSize) {
          largestSize = buffer.length;
        }

        // Generate filename based on omitFilename option
        let filename;
        if (omitFilename) {
          // When omitting filename, just use prefix+size+suffix
          filename = `${filenamePrefix}${sizeName}${filenameSuffix}.${format}`;
        } else {
          // When including filename, use processed name with size
          filename = `${processedName}_${sizeName}.${format}`;
        }

        // Organize files based on folder organization mode
        let folderPath;
        if (folderOrganization === 'by-original') {
          // Folder per original image - use original basename for folder
          folderPath = `${baseName}/${filename}`;
        } else if (folderOrganization === 'by-size') {
          // Folder per variant size - use size for folder, processed name for file
          // When omitFilename=true, use processedName; when false, filename already has it
          const sizeFilename = omitFilename
            ? `${processedName}.${format}`
            : `${processedName}.${format}`;
          folderPath = `${sizeName}/${sizeFilename}`;
        } else if (folderOrganization === 'flat') {
          // No folders - must ensure unique names across all images
          if (omitFilename) {
            // Include basename for uniqueness: prefix+basename_size+suffix
            folderPath = filenamePrefix || filenameSuffix
              ? `${filenamePrefix}${baseName}_${sizeName}${filenameSuffix}.${format}`
              : `${baseName}_${sizeName}.${format}`;
          } else {
            // Already includes basename in filename
            folderPath = filename;
          }
        } else {
          // Default to by-original
          folderPath = `${baseName}/${filename}`;
        }

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
