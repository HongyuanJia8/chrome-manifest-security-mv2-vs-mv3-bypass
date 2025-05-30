#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function manualTest() {
  const chromePath = path.join(__dirname, '../chrome-mac/Chromium.app/Contents/MacOS/Chromium');
  const extensionPath = path.resolve(__dirname, '../extensions/v2/dom-xss');
  
  console.log('Chrome path:', chromePath);
  console.log('Extension path:', extensionPath);
  
  try {
    console.log('Launching Chrome with DOM-XSS extension...');
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--auto-open-devtools-for-tabs'  // Automatically open DevTools
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      dumpio: true
    });
    
    console.log('✅ Chrome launched!');
    
    const page = await browser.newPage();
    console.log('✅ New page created!');
    
    // Set up console log monitoring
    page.on('console', msg => {
      console.log('[PAGE CONSOLE]', msg.type(), ':', msg.text());
    });
    
    // Set up dialog monitoring
    page.on('dialog', async dialog => {
      console.log('[ALERT DETECTED]', dialog.message());
      await dialog.accept();
    });
    
    console.log('Navigating to example.com...');
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded!');
    
    console.log('\n📌 Browser will stay open for manual testing.');
    console.log('📌 Check if alert popup appears (DOM XSS attack).');
    console.log('📌 Check DevTools console for "[dom-xss] XSS attack successful"');
    console.log('📌 Press Ctrl+C to close browser and exit.\n');
    
    // Keep the script running
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Closing browser...');
  process.exit(0);
});

manualTest(); 