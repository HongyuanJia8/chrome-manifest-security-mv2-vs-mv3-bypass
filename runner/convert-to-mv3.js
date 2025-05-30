#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conversion rules
const convertManifest = (manifest) => {
  const mv3 = { ...manifest };
  
  // Update manifest version
  mv3.manifest_version = 3;
  
  // Convert background scripts to service worker
  if (manifest.background) {
    if (manifest.background.scripts) {
      mv3.background = {
        service_worker: manifest.background.scripts[0] // Use first script as service worker
      };
    }
    delete mv3.background.persistent;
  }
  
  // Remove unsafe CSP
  if (manifest.content_security_policy) {
    delete mv3.content_security_policy;
  }
  
  // Convert browser_action to action
  if (manifest.browser_action) {
    mv3.action = manifest.browser_action;
    delete mv3.browser_action;
  }
  
  // Separate permissions and host_permissions
  if (manifest.permissions) {
    const hostPerms = [];
    const apiPerms = [];
    
    manifest.permissions.forEach(perm => {
      if (perm.includes('://') || perm === '<all_urls>') {
        hostPerms.push(perm);
      } else {
        apiPerms.push(perm);
      }
    });
    
    mv3.permissions = apiPerms;
    if (hostPerms.length > 0) {
      mv3.host_permissions = hostPerms;
    }
  }
  
  return mv3;
};

// Create MV3 version of extension
const createMV3Extension = (v2Path, v3Path) => {
  // Check if extension is in a subdirectory
  let manifestPath = path.join(v2Path, 'manifest.json');
  let actualV2Path = v2Path;
  
  if (!fs.existsSync(manifestPath)) {
    // Check for extension subdirectory
    const extensionPath = path.join(v2Path, 'extension');
    if (fs.existsSync(extensionPath)) {
      manifestPath = path.join(extensionPath, 'manifest.json');
      actualV2Path = extensionPath;
      v3Path = path.join(v3Path, 'extension');
    } else {
      throw new Error('manifest.json not found');
    }
  }
  
  // Create target directory
  if (!fs.existsSync(v3Path)) {
    fs.mkdirSync(v3Path, { recursive: true });
  }
  
  // Read manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Convert manifest
  const mv3Manifest = convertManifest(manifest);
  
  // Write new manifest
  fs.writeFileSync(
    path.join(v3Path, 'manifest.json'),
    JSON.stringify(mv3Manifest, null, 2)
  );
  
  // Copy other files
  const files = fs.readdirSync(actualV2Path);
  files.forEach(file => {
    if (file !== 'manifest.json') {
      const srcPath = path.join(actualV2Path, file);
      const destPath = path.join(v3Path, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        // Recursively copy directory
        copyDirectory(srcPath, destPath);
      } else {
        // Copy file, potentially modifying background.js
        let content = fs.readFileSync(srcPath, 'utf8');
        
        if (file === manifest.background?.scripts?.[0]) {
          // Add necessary modifications for service worker
          content = `// Converted to MV3 Service Worker\n${content}`;
          
          // Remove incompatible API calls
          content = content.replace(/chrome\.runtime\.onInstalled\.addListener\((.*?)\)/, (match, handler) => {
            return `chrome.runtime.onInstalled.addListener(${handler})\n// Note: Service workers don't persist, adjust logic accordingly`;
          });
        }
        
        fs.writeFileSync(destPath, content);
      }
    }
  });
  
  console.log(`✅ Converted ${path.basename(v2Path)} to MV3`);
};

// Recursively copy directory
const copyDirectory = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Main function
const main = () => {
  const v2Dir = path.join(__dirname, '../extensions/v2');
  const v3Dir = path.join(__dirname, '../extensions/v3');
  
  // Create v3 directory
  if (!fs.existsSync(v3Dir)) {
    fs.mkdirSync(v3Dir, { recursive: true });
  }
  
  // Get all v2 extensions
  const extensions = fs.readdirSync(v2Dir)
    .filter(f => fs.statSync(path.join(v2Dir, f)).isDirectory())
    .filter(f => f !== 'v3'); // Exclude existing v3 directory
  
  console.log(`🔄 Converting ${extensions.length} extensions to MV3...`);
  
  extensions.forEach(ext => {
    const v2Path = path.join(v2Dir, ext);
    const v3Path = path.join(v3Dir, ext);
    
    try {
      createMV3Extension(v2Path, v3Path);
    } catch (error) {
      console.error(`❌ Failed to convert ${ext}:`, error.message);
    }
  });
  
  console.log('\n✅ Conversion complete!');
  console.log('Note: Some extensions may need manual adjustments to work properly in MV3.');
};

// Run conversion
main(); 