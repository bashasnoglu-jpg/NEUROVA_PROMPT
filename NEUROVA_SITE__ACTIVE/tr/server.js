const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.avif': 'image/avif'
};

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle root redirect to /tr/
  if (req.url === '/') {
    res.writeHead(302, { 'Location': '/tr/index.html' });
    res.end();
    return;
  }

  // Serve from the project root (one level up) so /tr/ and /assets/ paths resolve correctly
  const SITE_ROOT = path.join(__dirname, '../');
  const TR_ROOT = path.join(SITE_ROOT, 'tr');

  // Remove query strings and leading slash to ensure relative path joining
  const cleanUrl = req.url.split('?')[0].replace(/^\//, '');
  const candidatePaths = [path.join(SITE_ROOT, cleanUrl)];

  if (cleanUrl && !cleanUrl.startsWith('tr/') && cleanUrl !== 'tr') {
    candidatePaths.push(path.join(TR_ROOT, cleanUrl));
  }

  // Basic security: prevent directory traversal
  if (!candidatePaths.every((p) => p.startsWith(SITE_ROOT))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const serveCandidate = (index) => {
    if (index >= candidatePaths.length) {
      const finalPath = candidatePaths[candidatePaths.length - 1];
      console.log(`404: ${finalPath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found', 'utf-8');
      return;
    }

    const currentPath = candidatePaths[index];
    const extname = path.extname(currentPath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(currentPath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          serveCandidate(index + 1);
          return;
        }
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  };

  serveCandidate(0);
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
