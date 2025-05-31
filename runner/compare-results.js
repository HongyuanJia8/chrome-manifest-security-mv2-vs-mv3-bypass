#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n📊 Test Results Comparison');
console.log('==================\n');

// Analyze real attack situation from server logs
const serverLogEvidence = {
  'cookie-hijacker': {
    evidence: 'Multiple POST /stolen requests',
    realV2Success: true,
    realV3Success: true // API still available
  },
  'keylogger': {
    evidence: 'userId=...&letters=...&type=keylogger',
    realV2Success: true,
    realV3Success: true // API still available
  },
  'eval-loader': {
    evidence: 'Multiple GET /payload.js requests',
    realV2Success: true,
    realV3Success: false // CSP blocks eval
  },
  'modify-header': {
    evidence: 'GET /config requests + page execution',
    realV2Success: true,
    realV3Success: true // HTML event handler bypass
  },
  'dom-xss': {
    evidence: 'Alert popup',
    realV2Success: true,
    realV3Success: false // CSP blocks inline scripts
  },
  'message-hijack': {
    evidence: 'GET /test/message-hijack',
    realV2Success: true,
    realV3Success: false // Service worker restrictions
  }
};

console.log('🔍 Real Attack Situation Based on Server Logs:\n');

for (const [ext, data] of Object.entries(serverLogEvidence)) {
  console.log(`${ext}:`);
  console.log(`  Evidence: ${data.evidence}`);
  console.log(`  MV2 Actual Success: ${data.realV2Success ? '✅' : '❌'}`);
  console.log(`  MV3 Actual Success: ${data.realV3Success ? '✅' : '❌'}`);
  console.log('');
}

console.log('\n📈 Original Test System vs Actual Results:\n');

const reportedResults = {
  'cookie-hijacker': { v2: '0.0%', v3: '0.0%' },
  'keylogger': { v2: '3.7%', v3: '0.0%' },
  'eval-loader': { v2: '0.0%', v3: '0.0%' },
  'modify-header': { v2: '79.2%', v3: '12.0%' },
  'dom-xss': { v2: '100.0%', v3: '0.0%' },
  'message-hijack': { v2: '0.0%', v3: '0.0%' }
};

console.log('| Extension | MV2 Reported | MV2 Actual | MV3 Reported | MV3 Actual | Issue |');
console.log('|-----------|--------------|------------|--------------|------------|--------|');

for (const [ext, reported] of Object.entries(reportedResults)) {
  const real = serverLogEvidence[ext];
  const v2Mismatch = (reported.v2 === '0.0%' && real.realV2Success) || 
                     (reported.v2 !== '100.0%' && real.realV2Success);
  const v3Mismatch = (reported.v3 === '0.0%' && real.realV3Success) ||
                     (reported.v3 !== '0.0%' && !real.realV3Success);
  
  const issue = v2Mismatch || v3Mismatch ? '⚠️ Detection Error' : '✅';
  
  console.log(`| ${ext} | ${reported.v2} | ${real.realV2Success ? '✅' : '❌'} | ${reported.v3} | ${real.realV3Success ? '✅' : '❌'} | ${issue} |`);
}

console.log('\n🚨 Key Findings:\n');

console.log('1. **Severe Detection Issues**:');
console.log('   - cookie-hijacker: Should be ~100% success in MV2, reported 0%');
console.log('   - keylogger: Should be ~100% success in MV2, reported 3.7%');
console.log('   - eval-loader: Should be ~100% success in MV2, reported 0%');
console.log('');

console.log('2. **MV3 Security Vulnerabilities**:');
console.log('   - modify-header: 12% success rate proves HTML event handler bypass');
console.log('   - cookie-hijacker/keylogger: APIs still usable with permissions');
console.log('');

console.log('3. **Detector Issues**:');
console.log('   - Timing: Background script requests may be outside detection window');
console.log('   - Detection conditions: Some conditions were incorrectly set');
console.log('   - Wait time: Longer wait times needed');
console.log('');

console.log('💡 Recommendations:\n');
console.log('1. Use the new server-based test system: ./run-server-test.sh');
console.log('2. System based on actual server requests, more accurate');
console.log('3. Can correctly reflect real attack success rates');
console.log('');

// Check for new test results
const resultsDir = path.join(__dirname, '../results/raw');
const files = fs.readdirSync(resultsDir);
const serverTestFiles = files.filter(f => f.includes('server-test'));

if (serverTestFiles.length > 0) {
  console.log('✅ Server test results found!\n');
  // TODO: Parse and display server test results
} else {
  console.log('ℹ️  No server tests run yet. Run ./run-server-test.sh for accurate results.');
} 