const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'www.vybeschool.com');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.mp4': 'video/mp4',
};

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.writeHead(404);
    res.end('Not found');
  });
  res.writeHead(200, { 'Content-Type': contentType });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  let filePath = path.join(PUBLIC, url);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
  } else {
    // SPA fallback
    const spaPath = path.join(PUBLIC, 'index.html');
    if (fs.existsSync(spaPath)) {
      serveFile(res, spaPath);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
