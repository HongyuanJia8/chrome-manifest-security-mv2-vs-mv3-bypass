#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test Chrome launch
async function testChromeLaunch() {
  const chromePath = path.join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
  console.log('Chrome path:', chromePath);
  
  try {
    console.log('Launching Chrome...');
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    console.log('✅ Chrome launched successfully!');
    
    const page = await browser.newPage();
    await page.goto('https://example.com');
    
    console.log('✅ Page loaded successfully!');
    
    // Wait a bit then close
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
    
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testChromeLaunch(); 