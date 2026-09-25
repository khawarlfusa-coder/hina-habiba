/**
 * Zero-dependency static file preview server for Hina Habiba Official Website.
 * Automatically detects free ports and avoids collisions.
 * Run using: node scripts/local-server.js [optional-port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Default to 8080 (or port passed via CLI / environment)
let DEFAULT_PORT = parseInt(process.argv[2] || process.env.PORT || 8080, 10);
// Root directory is one level above scripts/
const BASE_DIR = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createPreviewServer(port) {
  const server = http.createServer((req, res) => {
    let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
      safePath = '/index.html';
    }

    const filePath = path.join(BASE_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is currently in use by another app.`);
      console.log(`🔄 Automatically trying port ${port + 1}...`);
      createPreviewServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n=============================================================`);
    console.log(`✨ Hina Habiba Official Website is LIVE!`);
    console.log(`🌐 Click to open: http://localhost:${port}/`);
    console.log(`📁 Directory: ${BASE_DIR}`);
    console.log(`=============================================================\n`);
  });
}

createPreviewServer(DEFAULT_PORT);
