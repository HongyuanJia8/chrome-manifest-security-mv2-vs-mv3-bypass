export function attachDetectors(page, pattern) {
  const [type, arg] = pattern.split(':');

  switch (type) {

    case 'network_to':
      // Monitor all requests
      page.on('request', req => {
        const url = req.url();
        console.log(`[DETECTOR] Request: ${req.method()} ${url}`);
        // Check if URL contains the target
        if (url.includes(arg)) {
          console.log(`[DETECTOR] Network request to ${arg} detected in URL: ${url}`);
          page.___attackSuccess = true;
        }
      });
      
      page.on('requestfinished', req => {
        const url = req.url();
        if (url.includes(arg)) {
          console.log(`[DETECTOR] Request finished: ${url}`);
          page.___attackSuccess = true;
        }
      });
      
      page.on('requestfailed', req => {
        const url = req.url();
        console.log(`[DETECTOR] Request failed: ${url} - ${req.failure().errorText}`);
        // Even failed requests to target indicate attack attempt
        if (url.includes(arg)) {
          page.___attackSuccess = true;
        }
      });
      break;

    case 'console_contains':
      page.on('console', msg => {
        const text = msg.text();
        console.log(`[DETECTOR] Console ${msg.type()}: ${text}`);
        if (text.includes(arg)) {
          console.log(`[DETECTOR] Attack success - matched "${arg}"`);
          page.___attackSuccess = true;
        }
      });
      break;

    case 'dialog_alert':
      page.on('dialog', async dialog => {
        console.log(`[DETECTOR] Alert dialog detected: ${dialog.message()}`);
        page.___attackSuccess = true;
        await dialog.dismiss();
      });
      break;

    case 'cookie_read_from':      
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes(`cookies.getAll`) && text.includes(arg)) {
          console.log(`[DETECTOR] Cookie theft detected for domain: ${arg}`);
          page.___attackSuccess = true;
        }
      });
      break;

    default:
      console.warn('Unknown detector', pattern);
  }
}

// Dialog detector
export async function detectDialogAlert(page) {
  return new Promise((resolve) => {
    let detected = false;
    
    page.on('dialog', async (dialog) => {
      console.log(`[DETECTOR] Dialog detected: ${dialog.message()}`);
      detected = true;
      await dialog.dismiss();
      resolve(true);
    });
    
    // Set timeout
    setTimeout(() => {
      if (!detected) {
        resolve(false);
      }
    }, 10000);
  });
}

// Console content detector
export async function detectConsoleContains(page, searchText) {
  return new Promise((resolve) => {
    let detected = false;
    
    page.on('console', (msg) => {
      const text = msg.text();
      console.log(`[DETECTOR] Console ${msg.type()}: ${text}`);
      
      // Check for multiple patterns
      const patterns = [
        searchText,
        '[modify-header] Attack successful',
        'builtin payload executing',
        'HTML payload injected successfully'
      ];
      
      if (patterns.some(pattern => text.includes(pattern))) {
        console.log(`[DETECTOR] Console pattern matched: ${text}`);
        detected = true;
        resolve(true);
      }
    });
    
    // Also check for page errors that might indicate CSP violations
    page.on('pageerror', (error) => {
      console.log(`[DETECTOR] Page error: ${error.message}`);
    });
    
    // Set timeout
    setTimeout(() => {
      if (!detected) {
        resolve(false);
      }
    }, 10000);
  });
}
