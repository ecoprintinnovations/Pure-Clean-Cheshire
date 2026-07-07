const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const BASE_URL = 'https://purecleancheshire.co.uk';

const pages = [
  { url: '', changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString().split('T')[0] },
  { url: 'services.html', changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString().split('T')[0] },
  { url: 'pricing.html', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString().split('T')[0] },
  { url: 'about.html', changefreq: 'yearly', priority: 0.7, lastmod: new Date().toISOString().split('T')[0] },
  { url: 'areas.html', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString().split('T')[0] },
  { url: 'contact.html', changefreq: 'monthly', priority: 0.9, lastmod: new Date().toISOString().split('T')[0] }
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  
  pages.forEach(page => {
    const fullUrl = `${BASE_URL}/${page.url}`;
    sitemap += '  <url>\n';
    sitemap += `    <loc>${fullUrl}</loc>\n`;
    sitemap += `    <lastmod>${page.lastmod || today}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
  console.log('Generated: sitemap.xml');
}

function generateRobotsTxt() {
  let robots = '# Pure Clean Cheshire - Robots.txt\n';
  robots += `User-agent: *\n`;
  robots += `Allow: /\n\n`;
  robots += `Sitemap: ${BASE_URL}/sitemap.xml\n`;
  robots += `\n# Crawl-delay for respectful crawling\n`;
  robots += `Crawl-delay: 10\n`;
  
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);
  console.log('Generated: robots.txt');
}

console.log('Generating SEO files...');
generateSitemap();
generateRobotsTxt();
console.log('SEO generation complete!');