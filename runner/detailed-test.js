#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { BIN } from './utils/launchers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function detailedTest(extensionName, mode) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🔍 Detailed Testing: ${extensionName} in ${mode.toUpperCase()} mode`);
  console.log(`${'='.repeat(80)}\n`);
  
  const extensionPath = path.resolve(__dirname, `../extensions/${mode}/${extensionName}`);
  
  const browser = await puppeteer.launch({
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
  
  // Comprehensive monitoring
  const attackIndicators = {
    consoleMessages: [],
    dialogsShown: [],
    networkRequests: [],
    errors: [],
    injectedElements: 0,
    cspHeaders: null
  };
  
  // Monitor console
  page.on('console', msg => {
    const text = msg.text();
    attackIndicators.consoleMessages.push(`[${msg.type()}] ${text}`);
    console.log(`[CONSOLE ${msg.type()}] ${text}`);
  });
  
  // Monitor dialogs
  page.on('dialog', async dialog => {
    attackIndicators.dialogsShown.push(dialog.message());
    console.log(`[DIALOG] ${dialog.message()}`);
    await dialog.dismiss();
  });
  
  // Monitor network
  page.on('request', request => {
    if (request.url().includes('localhost:8000') || request.url().includes('stolen')) {
      attackIndicators.networkRequests.push(request.url());
      console.log(`[NETWORK] Request to: ${request.url()}`);
    }
  });
  
  // Monitor errors
  page.on('pageerror', error => {
    attackIndicators.errors.push(error.message);
    console.log(`[ERROR] ${error.message}`);
  });
  
  // Intercept responses to check CSP headers
  page.on('response', response => {
    if (response.url() === 'https://example.com/') {
      const headers = response.headers();
      attackIndicators.cspHeaders = headers['content-security-policy'] || 'No CSP header found';
      console.log(`[CSP] ${attackIndicators.cspHeaders}`);
    }
  });
  
  console.log('📡 Navigating to test page...');
  await page.goto('https://example.com', { waitUntil: 'networkidle2' });
  
  // Wait for potential attacks
  await page.waitForTimeout(5000);
  
  // Check for injected elements
  const pageAnalysis = await page.evaluate(() => {
    const results = {
      imgCount: document.querySelectorAll('img').length,
      scriptCount: document.querySelectorAll('script').length,
      iframeCount: document.querySelectorAll('iframe').length,
      suspiciousElements: []
    };
    
    // Look for suspicious attributes
    document.querySelectorAll('*').forEach(el => {
      if (el.hasAttribute('onload') || el.hasAttribute('onerror') || el.hasAttribute('onclick')) {
        results.suspiciousElements.push({
          tag: el.tagName,
          attributes: Array.from(el.attributes).map(a => `${a.name}="${a.value}"`)
        });
      }
    });
    
    return results;
  });
  
  attackIndicators.injectedElements = pageAnalysis.imgCount + pageAnalysis.scriptCount + pageAnalysis.iframeCount;
  
  // Final report
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 ATTACK ANALYSIS REPORT`);
  console.log(`${'='.repeat(80)}`);
  
  console.log(`\n🔍 Extension: ${extensionName} (${mode.toUpperCase()})`);
  console.log(`\n📋 Attack Indicators:`);
  console.log(`- Console messages with attack keywords: ${attackIndicators.consoleMessages.filter(m => 
    m.includes('attack') || m.includes('payload') || m.includes('executed') || m.includes('XSS')
  ).length}`);
  console.log(`- Dialogs/Alerts shown: ${attackIndicators.dialogsShown.length}`);
  console.log(`- Suspicious network requests: ${attackIndicators.networkRequests.length}`);
  console.log(`- Page errors: ${attackIndicators.errors.length}`);
  console.log(`- Injected elements: ${attackIndicators.injectedElements}`);
  console.log(`- Suspicious elements with event handlers: ${pageAnalysis.suspiciousElements.length}`);
  
  console.log(`\n🛡️ CSP Header: ${attackIndicators.cspHeaders}`);
  
  // Determine if attack succeeded
  const attackSucceeded = 
    attackIndicators.dialogsShown.length > 0 ||
    attackIndicators.networkRequests.length > 0 ||
    attackIndicators.consoleMessages.some(m => 
      m.toLowerCase().includes('attack successful') || 
      m.toLowerCase().includes('payload executed')
    ) ||
    pageAnalysis.suspiciousElements.length > 0;
  
  console.log(`\n✅ Attack Result: ${attackSucceeded ? '🚨 SUCCEEDED' : '🛡️ BLOCKED'}`);
  
  await browser.close();
  
  return { extensionName, mode, attackSucceeded, indicators: attackIndicators };
}

// Test different extensions
(async () => {
  const extensions = ['dom-xss', 'modify-header', 'unblock-access-control-allow-origin'];
  const results = [];
  
  for (const ext of extensions) {
    try {
      // Test v2
      const v2Result = await detailedTest(ext, 'v2');
      results.push(v2Result);
      
      // Test v3
      const v3Result = await detailedTest(ext, 'v3');
      results.push(v3Result);
    } catch (error) {
      console.error(`Failed to test ${ext}: ${error.message}`);
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 FINAL SUMMARY`);
  console.log(`${'='.repeat(80)}\n`);
  
  results.forEach(r => {
    console.log(`${r.extensionName} (${r.mode}): ${r.attackSucceeded ? '🚨 ATTACK SUCCEEDED' : '🛡️ ATTACK BLOCKED'}`);
  });
})(); 