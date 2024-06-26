const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'connect.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading connect.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));