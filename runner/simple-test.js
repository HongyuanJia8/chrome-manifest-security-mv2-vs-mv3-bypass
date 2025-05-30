#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function simpleTest() {
  const chromePath = path.join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
  
  console.log('Step 1: Launching Chrome without extensions...');
  
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      timeout: 10000  // 10 seconds timeout
    });
    
    console.log('✅ Chrome launched successfully!');
    
    console.log('Step 2: Opening new page...');
    const page = await browser.newPage();
    
    console.log('Step 3: Navigating to example.com...');
    await page.goto('https://example.com', { timeout: 10000 });
    
    console.log('✅ Page loaded successfully!');
    
    // Wait 3 seconds
    console.log('Waiting 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Step 4: Closing browser...');
    await browser.close();
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

simpleTest(); 