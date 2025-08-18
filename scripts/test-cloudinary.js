// Test Cloudinary configuration
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Testing Cloudinary Configuration...\n');

// Check if environment variables are loaded
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing');
console.log('CLOUDINARY_UPLOAD_PRESET:', process.env.CLOUDINARY_UPLOAD_PRESET || 'Not set (optional)');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection with a simple API call
console.log('\nTesting Cloudinary API connection...');

try {
  // Try to get account usage (this requires valid credentials)
  cloudinary.api.usage()
    .then(result => {
      console.log('✅ Cloudinary connection successful!');
      console.log('\nAccount Details:');
      console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
      console.log('- Plan:', result.plan);
      console.log('- Used Credits:', result.credits?.usage || 'N/A');
      console.log('- Total Credits:', result.credits?.limit || 'N/A');
      console.log('- Bandwidth Used:', `${(result.bandwidth?.usage / 1024 / 1024 / 1024).toFixed(2)} GB`);
      console.log('- Storage Used:', `${(result.storage?.usage / 1024 / 1024).toFixed(2)} MB`);
      
      // Try to create the upload preset if it doesn't exist
      console.log('\nChecking upload preset...');
      const presetName = process.env.CLOUDINARY_UPLOAD_PRESET || 'estampanda-stickers';
      
      cloudinary.api.upload_preset(presetName)
        .then(() => {
          console.log(`✅ Upload preset "${presetName}" exists`);
        })
        .catch(() => {
          console.log(`⚠️  Upload preset "${presetName}" not found, creating...`);
          
          cloudinary.api.create_upload_preset({
            name: presetName,
            unsigned: false,
            folder: 'estampanda/designs',
            allowed_formats: 'jpg,jpeg,png,svg,webp,gif',
            transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }
            ]
          })
          .then(() => {
            console.log(`✅ Upload preset "${presetName}" created successfully`);
          })
          .catch(error => {
            console.log(`❌ Could not create upload preset: ${error.message}`);
          });
        });
    })
    .catch(error => {
      console.error('❌ Cloudinary connection failed:', error.message);
      console.log('\nPlease check your credentials in .env.local');
    });
} catch (error) {
  console.error('❌ Error testing Cloudinary:', error);
}