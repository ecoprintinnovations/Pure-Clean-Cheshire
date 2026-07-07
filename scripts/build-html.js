const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const LightningCSS = require('lightningcss');

const SRC_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '../dist');
const PAGES_DIR = path.join(SRC_DIR, 'pages');

// Pages to process
const pages = [
  { src: 'index.html', dest: 'index.html' },
  { src: 'pages/services.html', dest: 'services.html' },
  { src: 'pages/pricing.html', dest: 'pricing.html' },
  { src: 'pages/about.html', dest: 'about.html' },
  { src: 'pages/areas.html', dest: 'areas.html' },
  { src: 'pages/contact.html', dest: 'contact.html' }
];

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}
if (!fs.existsSync(path.join(DIST_DIR, 'css'))) {
  fs.mkdirSync(path.join(DIST_DIR, 'css'), { recursive: true });
}
if (!fs.existsSync(path.join(DIST_DIR, 'js'))) {
  fs.mkdirSync(path.join(DIST_DIR, 'js'), { recursive: true });
}
if (!fs.existsSync(path.join(DIST_DIR, 'images'))) {
  fs.mkdirSync(path.join(DIST_DIR, 'images'), { recursive: true });
}

async function minifyHTML(html) {
  return html
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    // Remove space around tags
    .replace(/>\s+</g, '><')
    // Remove leading/trailing whitespace
    .trim();
}

async function processPage(page) {
  const srcPath = path.join(SRC_DIR, page.src);
  const destPath = path.join(DIST_DIR, page.dest);
  
  let html = fs.readFileSync(srcPath, 'utf8');
  
  // Update CSS reference to minified version
  html = html.replace(
    'href="css/main.css"',
    'href="css/main.min.css"'
  ).replace(
    'href="../css/main.css"',
    'href="../css/main.min.css"'
  ).replace(
    'href="/css/main.css"',
    'href="/css/main.min.css"'
  ).replace(
    'href="/css/main.min.css"',
    'href="/css/main.min.css"'
  );
  
  // Update JS reference to minified version
  html = html.replace(
    'src="../js/main.js"',
    'src="../js/main.min.js"'
  ).replace(
    'src="js/main.js"',
    'src="js/main.min.js"'
  );
  
  // Update favicon path for pages in subdirectories
  if (page.src.includes('pages/')) {
    html = html.replace(
      'href="../images/favicon.svg"',
      'href="../images/favicon.svg"'
    );
    html = html.replace(
      'href="images/favicon.svg"',
      'href="../images/favicon.svg"'
    );
  }
  
  // Minify HTML
  const minified = await minifyHTML(html);
  
  fs.writeFileSync(destPath, minified);
  console.log(`Built: ${page.dest}`);
}

async function build() {
  console.log('Building HTML pages...');
  
  for (const page of pages) {
    await processPage(page);
  }
  
  console.log('HTML build complete!');
}

build().catch(console.error);