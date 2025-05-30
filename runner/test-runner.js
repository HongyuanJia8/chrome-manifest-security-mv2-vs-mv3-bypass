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
  .requiredOption('--ext <name>', 'extension name in config.json')
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
  const browser = await puppeteer.launch({
    headless: false,                    
    executablePath: BIN[opts.mode],
    args: [
      `--disable-extensions-except=${path.resolve(target.path)}`,
      `--load-extension=${path.resolve(target.path)}`,
      '--no-sandbox'
    ]
  });

  const page = await browser.newPage();
  attachDetectors(page, target.success_detector);

  let reason = '';
  try {
    await page.goto(target.trigger_url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(8000);
  } catch (e) {
    reason = e.message;
  }

  const success = !!page.___attackSuccess;
  await csvWriter.writeRecords([
    {
      name: target.name,
      attack: target.attack,
      mode: opts.mode,
      success,
      reason: success ? '' : reason || 'not triggered'
    }
  ]);
  await browser.close();
  console.log(`✅ ${target.name} (${opts.mode}) finished:`, success);
})();
