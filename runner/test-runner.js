#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { createObjectCsvWriter } from 'csv-writer';
import puppeteer from 'puppeteer-core';
import { BIN } from './utils/launchers.js';
import { attachDetectors } from './utils/detectors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

program
  .requiredOption('--ext <n>', 'extension name in config.json')
  .requiredOption('--mode <v2|v3>', 'browser mode')
  .parse();
const opts = program.opts();

const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'))
);
const target = CONFIG.find(x => x.name === opts.ext);
if (!target) {
  console.error('❌ extension not found in config.json');
  process.exit(1);
}

const csvWriter = createObjectCsvWriter({
  path: path.join(
    __dirname,
    `../results/raw/${Date.now()}_${target.name}_${opts.mode}.csv`
  ),
  header: [
    { id: 'name', title: 'name' },
    { id: 'attack', title: 'attack' },
    { id: 'mode', title: 'mode' },
    { id: 'success', title: 'success' },
    { id: 'reason', title: 'reason' }
  ]
});

(async () => {
  let browser;
  try {
    const extensionPath = path.resolve(__dirname, target.path);
    console.log(`Loading extension from: ${extensionPath}`);
    
    // Simplified launch args
    const launchArgs = [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ];
    
    console.log(`Launching ${opts.mode} browser...`);
    browser = await puppeteer.launch({
      headless: false,
      executablePath: BIN[opts.mode],
      args: launchArgs,
      ignoreDefaultArgs: ['--disable-extensions'],
      dumpio: true,  // Show browser console output
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false
    });

    console.log('Browser launched, creating page...');
    const page = await browser.newPage();
    
    console.log('Attaching detectors...');
    attachDetectors(page, target.success_detector);

    let reason = '';
    try {
      console.log(`Navigating to ${target.trigger_url}...`);
      await page.goto(target.trigger_url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      console.log('Page loaded, waiting for attack to execute...');
      await page.waitForTimeout(5000);
    } catch (e) {
      reason = e.message;
      console.error('Navigation error:', reason);
    }

    const success = !!page.___attackSuccess;
    console.log('Attack success:', success);
    
    await csvWriter.writeRecords([
      {
        name: target.name,
        attack: target.attack,
        mode: opts.mode,
        success,
        reason: success ? '' : reason || 'not triggered'
      }
    ]);
    
    console.log(`✅ ${target.name} (${opts.mode}) finished:`, success);
  } catch (error) {
    console.error('Test error:', error.message);
    await csvWriter.writeRecords([
      {
        name: target.name,
        attack: target.attack,
        mode: opts.mode,
        success: false,
        reason: error.message
      }
    ]);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
  
  process.exit(0);
})();
