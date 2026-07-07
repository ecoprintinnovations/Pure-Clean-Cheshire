const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '../dist');

const assetsToCopy = [
  { src: 'images/favicon.svg', dest: 'images/favicon.svg' },
  { src: 'images', dest: 'images', recursive: true },
  { src: 'public/manifest.json', dest: 'manifest.json' },
  { src: 'public/sw.js', dest: 'sw.js' },
  { src: 'public/404.html', dest: '404.html' }
];

function copyAsset(asset) {
  const srcPath = path.join(SRC_DIR, asset.src);
  const destPath = path.join(DIST_DIR, asset.dest);
  
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source not found: ${srcPath}`);
    return;
  }
  
  const stat = fs.statSync(srcPath);
  
  if (stat.isDirectory() && asset.recursive) {
    copyDir(srcPath, destPath);
  } else {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${asset.src} -> ${asset.dest}`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  console.log(`Copied directory: ${src} -> ${dest}`);
}

console.log('Copying assets...');
assetsToCopy.forEach(copyAsset);
console.log('Asset copy complete!');