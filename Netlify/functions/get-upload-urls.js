import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomBytes } from 'crypto';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { files } = JSON.parse(event.body);

    if (!files || !Array.isArray(files) || files.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Files array is required' }),
      };
    }

    const batchId = randomBytes(16).toString('hex');
    const uploadUrls = [];

    for (const file of files) {
      const { name, type } = file;
      const key = `temp/${batchId}/${name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        ContentType: type,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 900,
      });

      uploadUrls.push({
        fileName: name,
        uploadUrl: presignedUrl,
        key,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        batchId,
        uploadUrls,
      }),
    };
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate upload URLs',
        message: error.message,
      }),
    };
  }
};
