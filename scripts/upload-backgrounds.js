#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Load environment variables
require('dotenv').config();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   CLOUDFLARE_ACCOUNT_ID (or R2_ACCOUNT_ID)');
  console.error('   CLOUDFLARE_API_KEY');
  console.error('\nPlease add CLOUDFLARE_API_KEY to your .env file');
  process.exit(1);
}

const backgrounds = [
  {
    name: 'fall-road',
    file: path.join(__dirname, '../assets/fall-road/xxl.webp'),
    id: 'image-scoop/backgrounds/fall-road',
  },
  {
    name: 'mountains',
    file: path.join(__dirname, '../assets/mountains/xxl.webp'),
    id: 'image-scoop/backgrounds/mountains',
  },
  {
    name: 'waterfall',
    file: path.join(__dirname, '../assets/waterfall/xxl.webp'),
    id: 'image-scoop/backgrounds/waterfall',
  },
];

async function uploadImage(background) {
  console.log(`\n📤 Uploading ${background.name}...`);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(background.file));
  formData.append('id', background.id);
  formData.append('requireSignedURLs', 'false');

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          ...formData.getHeaders(),
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log(`✅ ${background.name} uploaded successfully!`);
      console.log(`   ID: ${background.id}`);
      console.log(`   URL: ${result.result.variants[0]}`);
      return result.result;
    } else {
      console.error(`❌ Failed to upload ${background.name}:`);
      console.error(`   ${JSON.stringify(result.errors, null, 2)}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading ${background.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting background image upload to Cloudflare Images...');
  console.log(`   Account ID: ${CLOUDFLARE_ACCOUNT_ID}`);

  const results = [];

  for (const background of backgrounds) {
    const result = await uploadImage(background);
    if (result) {
      results.push({
        name: background.name,
        id: background.id,
        url: result.variants[0],
      });
    }
    // Small delay between uploads
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n\n✨ Upload Summary:');
  console.log('=====================================');
  
  if (results.length > 0) {
    console.log('\n📸 Successfully uploaded images:');
    results.forEach((r) => {
      console.log(`\n   ${r.name}:`);
      console.log(`   ID: ${r.id}`);
      console.log(`   URL: ${r.url}`);
    });

    console.log('\n\n📝 Add these to your UploadStep.jsx:');
    console.log('=====================================');
    console.log('const backgrounds = [');
    results.forEach((r) => {
      console.log(`  \`https://imagedelivery.net/\${CLOUDFLARE_HASH}/${r.id}/public\`,`);
    });
    console.log('];');
  } else {
    console.log('\n❌ No images were uploaded successfully.');
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
