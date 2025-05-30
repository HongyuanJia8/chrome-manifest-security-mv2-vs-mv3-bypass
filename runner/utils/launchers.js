import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');    

export const BIN = {
  v2: path.join(ROOT, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'),
  v3: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' 
};
