/**
 * Build script for preparing the application for deployment
 * 
 * This script performs the following tasks:
 * 1. Lints the codebase
 * 2. Builds the application for production
 * 3. Outputs deployment info
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}====================================${colors.reset}`);
console.log(`${colors.blue}Remu E-commerce Platform Build Script${colors.reset}`);
console.log(`${colors.cyan}====================================${colors.reset}\n`);

try {
  // Step 1: Checking environment variables
  console.log(`${colors.yellow}Checking environment variables...${colors.reset}`);
  
  const envFile = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envFile)) {
    console.error(`${colors.red}Error: .env.local file missing!${colors.reset}`);
    console.log(`${colors.yellow}Please create a .env.local file with your Firebase config.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Environment variables found${colors.reset}\n`);
  
  // Step 2: Linting
  console.log(`${colors.yellow}Linting code...${colors.reset}`);
  execSync('npm run lint', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Linting completed${colors.reset}\n`);
  
  // Step 3: Building
  console.log(`${colors.yellow}Building for production...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Build completed${colors.reset}\n`);
  
  // Step 4: Success message
  console.log(`${colors.cyan}====================================${colors.reset}`);
  console.log(`${colors.green}Build Successful! 🚀${colors.reset}`);
  console.log(`${colors.cyan}====================================${colors.reset}\n`);
  
  console.log(`${colors.blue}To start the production server:${colors.reset}`);
  console.log(`npm run start\n`);
  
  console.log(`${colors.blue}To deploy to Netlify:${colors.reset}`);
  console.log(`1. Push code to your repository`);
  console.log(`2. Connect Netlify to your repository`);
  console.log(`3. Use the following build settings:`);
  console.log(`   - Build command: npm run build`);
  console.log(`   - Publish directory: .next\n`);
  
  console.log(`${colors.blue}To deploy to Vercel:${colors.reset}`);
  console.log(`vercel\n`);
  
} catch (error) {
  console.error(`${colors.red}Build failed:${colors.reset}`, error.message);
  process.exit(1);
} 