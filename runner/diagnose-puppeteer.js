#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function diagnose() {
  const chromePath = path.join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
  
  console.log('🔍 Puppeteer Diagnosis Tool');
  console.log('=========================');
  console.log('Chrome path:', chromePath);
  console.log('Puppeteer version:', puppeteer._version || 'unknown');
  
  // Method 1: Direct spawn to test Chrome
  console.log('\n1. Testing Chrome directly...');
  const chromeTest = spawn(chromePath, ['--version']);
  
  chromeTest.stdout.on('data', (data) => {
    console.log(`✅ Chrome version: ${data.toString().trim()}`);
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Method 2: Try with different connection options
  console.log('\n2. Testing Puppeteer connection with pipe...');
  try {
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      pipe: true,  // Use pipe instead of WebSocket
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      timeout: 5000
    });
    
    console.log('✅ Browser launched successfully with pipe!');
    await browser.close();
  } catch (error) {
    console.log('❌ Pipe connection failed:', error.message);
  }
  
  // Method 3: Try with stdio pipe
  console.log('\n3. Testing with stdio pipe...');
  try {
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      pipe: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--remote-debugging-port=0'  // Let Chrome choose the port
      ],
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false,
      dumpio: true,
      timeout: 10000
    });
    
    console.log('✅ Browser launched successfully with WebSocket!');
    
    const page = await browser.newPage();
    console.log('✅ Page created successfully!');
    
    await page.goto('https://example.com');
    console.log('✅ Navigation successful!');
    
    await browser.close();
    console.log('✅ Browser closed successfully!');
    
  } catch (error) {
    console.log('❌ WebSocket connection failed:', error.message);
    console.log('Full error:', error);
  }
}

diagnose().catch(console.error); 