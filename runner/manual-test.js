#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIN } from './utils/launchers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testModifyHeader(mode) {
  console.log(`\n🔍 Testing modify-header in ${mode.toUpperCase()} mode\n`);
  
  const extensionPath = path.resolve(__dirname, `../extensions/${mode}/modify-header`);
  console.log(`📁 Extension path: ${extensionPath}`);
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: BIN[mode],
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--auto-open-devtools-for-tabs'  // Auto-open DevTools
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
    dumpio: true
  });

  console.log('✅ Browser launched');
  
  const page = await browser.newPage();
  
  // Listen to all console messages
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE ${msg.type()}] ${msg.text()}`);
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  // Listen to dialog events
  page.on('dialog', async dialog => {
    console.log(`[DIALOG] ${dialog.type()}: ${dialog.message()}`);
    await dialog.dismiss();
  });
  
  console.log('📡 Navigating to example.com...');
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  
  console.log('⏳ Waiting 10 seconds for any attacks to execute...');
  await page.waitForTimeout(10000);
  
  // Try to check if the payload was injected
  const htmlContent = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    return {
      imgCount: imgs.length,
      bodyHTML: document.body.innerHTML.substring(0, 500)
    };
  });
  
  console.log(`\n📊 Page Analysis:`);
  console.log(`- Image elements found: ${htmlContent.imgCount}`);
  console.log(`- Body HTML preview: ${htmlContent.bodyHTML}...`);
  
  console.log('\n⏸️  Keeping browser open for 30 seconds for manual inspection...');
  console.log('Check the DevTools console for any messages!');
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('✅ Test completed');
}

// Test both modes
(async () => {
  const mode = process.argv[2] || 'v3';
  
  if (mode === 'both') {
    await testModifyHeader('v2');
    console.log('\n' + '='.repeat(80) + '\n');
    await testModifyHeader('v3');
  } else {
    await testModifyHeader(mode);
  }
})(); 