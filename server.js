const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);

  let filePath;
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else if (req.url === '/snap.manifest.json') {
    filePath = path.join(__dirname, 'snap.manifest.json');
  } else if (req.url === '/dist/bundle.js') {
    filePath = path.join(__dirname, 'dist', 'bundle.js');
  } else if (req.url === '/images/icon.svg') {
    filePath = path.join(__dirname, 'images', 'icon.svg');
  } else {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      res.writeHead(500);
      res.end('Server Error');
    } else {
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.json') contentType = 'application/json';
      if (ext === '.svg') contentType = 'image/svg+xml';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));