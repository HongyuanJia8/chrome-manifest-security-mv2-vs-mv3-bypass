#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read configuration
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config.json'))
);

// Test modes
const MODES = ['v2', 'v3'];
const REPEAT_COUNT = 3; // Repeat each test 3 times

console.log('🚀 Starting automated test suite...');
console.log(`📊 Testing ${CONFIG.length} extensions in ${MODES.length} modes`);
console.log(`🔁 Each test will run ${REPEAT_COUNT} times\n`);

// Start test server
const serverProcess = spawn('node', [path.join(__dirname, 'test-server.js')], {
  stdio: 'inherit'
});

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 2000));

async function runTest(ext, mode, iteration) {
  return new Promise((resolve, reject) => {
    console.log(`\n📝 Testing ${ext.name} (${mode}) - Run ${iteration + 1}/${REPEAT_COUNT}`);
    
    const testProcess = spawn('node', [
      path.join(__dirname, 'test-runner.js'),
      '--ext', ext.name,
      '--mode', mode
    ], {
      stdio: 'inherit'
    });
    
    testProcess.on('close', code => {
      if (code === 0) {
        console.log(`✅ ${ext.name} (${mode}) - Run ${iteration + 1} completed`);
        resolve();
      } else {
        console.log(`❌ ${ext.name} (${mode}) - Run ${iteration + 1} failed with code ${code}`);
        reject(new Error(`Test failed with code ${code}`));
      }
    });
  });
}

// Run all tests
try {
  for (const ext of CONFIG) {
    for (const mode of MODES) {
      // Adjust path based on mode
      let testPath = ext.path;
      if (mode === 'v3') {
        // Convert v2 path to v3 path
        testPath = testPath.replace('/v2/', '/v3/');
      }
      
      // Check if extension path exists
      const extPath = path.resolve(__dirname, testPath);
      if (!fs.existsSync(extPath)) {
        console.log(`⚠️  Skipping ${ext.name} (${mode}) - Extension path not found: ${extPath}`);
        continue;
      }
      
      // Create temporary configuration
      const tempConfig = { ...ext, path: testPath };
      
      for (let i = 0; i < REPEAT_COUNT; i++) {
        try {
          // Dynamically update configuration file
          const configData = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
          const configIndex = configData.findIndex(c => c.name === ext.name);
          if (configIndex >= 0) {
            configData[configIndex] = tempConfig;
            fs.writeFileSync(
              path.join(__dirname, 'config.json'),
              JSON.stringify(configData, null, 2)
            );
          }
          
          await runTest(ext, mode, i);
          // Test interval
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`❌ Test failed: ${error.message}`);
        }
      }
      
      // Restore original configuration
      const originalConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
      const originalIndex = originalConfig.findIndex(c => c.name === ext.name);
      if (originalIndex >= 0) {
        originalConfig[originalIndex] = ext;
        fs.writeFileSync(
          path.join(__dirname, 'config.json'),
          JSON.stringify(originalConfig, null, 2)
        );
      }
    }
  }
  
  console.log('\n✅ All tests completed!');
  
} catch (error) {
  console.error('❌ Test suite failed:', error);
} finally {
  // Shut down test server
  console.log('\n👋 Shutting down test server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
} 