const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle streaming endpoint
  if (req.url === '/stream') {
    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    // Send initial greeting
    res.write('Hello! Starting calculation process...\n');
    // Explicitly flush the data
    res.flushHeaders();
    
    let iteration = 0;
    let lastPrime = 1;
    
    // Function to find the next prime number
    const findNextPrime = (num) => {
      while (true) {
        num++;
        let isPrime = true;
        
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            isPrime = false;
            break;
          }
        }
        
        if (isPrime) return num;
      }
    };
    
    // Set interval to simulate calculation and send updates
    const intervalId = setInterval(() => {
      iteration++;
      
      // Find next prime number
      lastPrime = findNextPrime(lastPrime);
      
      // Send progress update
      res.write(`Iteration ${iteration}/20: Found prime number ${lastPrime}\n`);
      // Explicitly flush the data after each write
      res.flushHeaders();
      
      // End after 20 iterations
      if (iteration >= 20) {
        res.write('Calculation complete!\n');
        res.end();
        clearInterval(intervalId);
      }
    }, 1000); // Send update every second
    
    // Handle client disconnect
    req.on('close', () => {
      clearInterval(intervalId);
    });
  } 
  // Serve static files
  else {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
    }
    
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('File not found');
        } else {
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Stream available at http://localhost:${PORT}/stream`);
});
