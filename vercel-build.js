const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
function exec(command) {
  console.log(`Executing: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Main build function
async function build() {
  console.log('Starting custom Vercel build process...');
  
  // Create or ensure .npmrc exists with correct settings
  fs.writeFileSync('.npmrc', 'legacy-peer-deps=true\nstrict-peer-dependencies=false\n');
  console.log('Created .npmrc file with legacy-peer-deps=true');
  
  // Run the Next.js build
  console.log('Running Next.js build...');
  exec('next build');
  
  console.log('Build completed successfully!');
}

// Run the build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
