const { createServer } = require('http');
const { readFileSync, existsSync } = require('fs');
const { join, extname } = require('path');

const port = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  console.log(`Received request for ${req.url}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath;
  if (req.url === '/' || req.url === '/snap.manifest.json') {
    filePath = join(__dirname, 'snap.manifest.json');
  } else if (req.url === '/bundle.js') {
    filePath = join(__dirname, 'dist', 'bundle.js');
  } else if (req.url.startsWith('/images/')) {
    filePath = join(__dirname, req.url);
  } else {
    console.log(`404 Not Found: ${req.url}`);
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    console.log(`Served ${req.url} successfully`);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Serving snap at http://localhost:${port}`);
});