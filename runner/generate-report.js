#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsDir = path.join(__dirname, '../results/raw');
const reportPath = path.join(__dirname, '../results/report.md');

// Read all CSV files
const csvFiles = fs.readdirSync(resultsDir)
  .filter(f => f.endsWith('.csv'))
  .sort((a, b) => b.localeCompare(a)); // Newest first

if (csvFiles.length === 0) {
  console.error('No test results found!');
  process.exit(1);
}

// Parse all results
const allResults = [];
csvFiles.forEach(file => {
  const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');
  const records = parse(content, { columns: true });
  allResults.push(...records);
});

// Group statistics by extension name and mode
const stats = {};
allResults.forEach(result => {
  const key = `${result.name}_${result.mode}`;
  if (!stats[key]) {
    stats[key] = {
      name: result.name,
      attack: result.attack,
      mode: result.mode,
      total: 0,
      success: 0,
      failures: []
    };
  }
  stats[key].total++;
  if (result.success === 'true' || result.success === true) {
    stats[key].success++;
  } else {
    stats[key].failures.push(result.reason || 'Unknown');
  }
});

// Generate report
let report = `# Chrome Extension Security Test Report

Generated: ${new Date().toISOString()}

## Summary

Total tests run: ${allResults.length}

## Results by Extension

`;

// Group display by extension name
const extensions = [...new Set(Object.values(stats).map(s => s.name))];
extensions.forEach(extName => {
  report += `### ${extName}\n\n`;
  
  const v2Stats = Object.values(stats).find(s => s.name === extName && s.mode === 'v2');
  const v3Stats = Object.values(stats).find(s => s.name === extName && s.mode === 'v3');
  
  report += `| Mode | Attack Type | Success Rate | Notes |\n`;
  report += `|------|-------------|--------------|-------|\n`;
  
  if (v2Stats) {
    const rate = v2Stats.total > 0 ? ((v2Stats.success / v2Stats.total) * 100).toFixed(1) : '0.0';
    report += `| MV2 | ${v2Stats.attack} | ${rate}% (${v2Stats.success}/${v2Stats.total}) | `;
    if (v2Stats.failures.length > 0) {
      report += `Failures: ${[...new Set(v2Stats.failures)].join(', ')} `;
    }
    report += `|\n`;
  }
  
  if (v3Stats) {
    const rate = v3Stats.total > 0 ? ((v3Stats.success / v3Stats.total) * 100).toFixed(1) : '0.0';
    report += `| MV3 | ${v3Stats.attack} | ${rate}% (${v3Stats.success}/${v3Stats.total}) | `;
    if (v3Stats.failures.length > 0) {
      report += `Failures: ${[...new Set(v3Stats.failures)].join(', ')} `;
    }
    report += `|\n`;
  }
  
  report += `\n`;
});

// Add analysis
report += `## Analysis

### Effectiveness of MV3 CSP Protection

`;

// Calculate success rate for each attack type in MV2 and MV3
const attackTypes = [...new Set(Object.values(stats).map(s => s.attack))];
attackTypes.forEach(attack => {
  const v2Results = Object.values(stats).filter(s => s.attack === attack && s.mode === 'v2');
  const v3Results = Object.values(stats).filter(s => s.attack === attack && s.mode === 'v3');
  
  const v2Success = v2Results.reduce((sum, r) => sum + r.success, 0);
  const v2Total = v2Results.reduce((sum, r) => sum + r.total, 0);
  const v3Success = v3Results.reduce((sum, r) => sum + r.success, 0);
  const v3Total = v3Results.reduce((sum, r) => sum + r.total, 0);
  
  if (v2Total > 0 || v3Total > 0) {
    const v2Rate = v2Total > 0 ? ((v2Success / v2Total) * 100).toFixed(1) : 'N/A';
    const v3Rate = v3Total > 0 ? ((v3Success / v3Total) * 100).toFixed(1) : 'N/A';
    
    report += `- **${attack}**: MV2 success rate ${v2Rate}% → MV3 success rate ${v3Rate}%`;
    
    if (v2Rate !== 'N/A' && v3Rate !== 'N/A') {
      const improvement = parseFloat(v2Rate) - parseFloat(v3Rate);
      if (improvement > 0) {
        report += ` (${improvement.toFixed(1)}% improvement)`;
      } else if (improvement < 0) {
        report += ` (⚠️ ${Math.abs(improvement).toFixed(1)}% regression)`;
      }
    }
    report += `\n`;
  }
});

// Save report
fs.writeFileSync(reportPath, report);
console.log(`✅ Report generated: ${reportPath}`);

// Print brief summary
console.log('\n📊 Quick Summary:');
extensions.forEach(extName => {
  const v2Stats = Object.values(stats).find(s => s.name === extName && s.mode === 'v2');
  const v3Stats = Object.values(stats).find(s => s.name === extName && s.mode === 'v3');
  
  if (v2Stats && v2Stats.total > 0) {
    const rate = ((v2Stats.success / v2Stats.total) * 100).toFixed(1);
    console.log(`  ${extName} (MV2): ${rate}% success`);
  }
  if (v3Stats && v3Stats.total > 0) {
    const rate = ((v3Stats.success / v3Stats.total) * 100).toFixed(1);
    console.log(`  ${extName} (MV3): ${rate}% success`);
  }
}); 