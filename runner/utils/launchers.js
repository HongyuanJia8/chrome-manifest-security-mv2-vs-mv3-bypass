import path from 'path';
const ROOT = path.resolve('../..');    

export const BIN = {
  v2: path.join(ROOT, 'chromium109', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
  v3: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' 
};
