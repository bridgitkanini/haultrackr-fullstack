const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build...');

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });
  
  // Run the build
  console.log('Running build...');
  execSync('pnpm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
