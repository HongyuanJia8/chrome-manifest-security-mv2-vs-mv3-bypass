#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cdpTest() {
  const chromePath = path.join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
  const extensionPath = path.resolve(__dirname, '../extensions/v2/dom-xss');
  
  console.log('Launching Chrome with remote debugging...');
  
  // Launch Chrome with remote debugging
  const chromeProcess = spawn(chromePath, [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--remote-debugging-port=9222',
    '--user-data-dir=/tmp/chrome-test-profile',
    'https://example.com'
  ]);
  
  chromeProcess.stdout.on('data', (data) => {
    console.log(`Chrome stdout: ${data}`);
  });
  
  chromeProcess.stderr.on('data', (data) => {
    console.log(`Chrome stderr: ${data}`);
  });
  
  console.log('Chrome launched with PID:', chromeProcess.pid);
  console.log('\n📌 Chrome is running with the DOM-XSS extension');
  console.log('📌 Check if alert popup appears');
  console.log('📌 Navigate to chrome://extensions to verify extension is loaded');
  console.log('📌 Press Ctrl+C to close\n');
  
  // Keep process running
  process.on('SIGINT', () => {
    console.log('\n👋 Closing Chrome...');
    chromeProcess.kill();
    process.exit(0);
  });
}

cdpTest(); 