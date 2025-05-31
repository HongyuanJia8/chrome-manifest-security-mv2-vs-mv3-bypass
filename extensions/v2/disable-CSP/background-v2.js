// Disable CSP Extension - MV2 Version
let isEnabled = false;

// Remove CSP headers on all requests
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    if (!isEnabled) return;
    
    console.log('[disable-CSP] Processing headers for:', details.url);
    
    for (let i = 0; i < details.responseHeaders.length; i++) {
      const header = details.responseHeaders[i];
      const name = header.name.toLowerCase();
      
      // Remove CSP related headers
      if (name === 'content-security-policy' || 
          name === 'content-security-policy-report-only' ||
          name === 'x-content-security-policy') {
        console.log('[disable-CSP] Removing CSP header:', header.name);
        details.responseHeaders.splice(i, 1);
        i--;
      }
    }
    
    return { responseHeaders: details.responseHeaders };
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
);

// Toggle on/off when icon clicked
chrome.browserAction.onClicked.addListener(function() {
  isEnabled = !isEnabled;
  console.log('[disable-CSP] Extension is now:', isEnabled ? 'enabled' : 'disabled');
  
  chrome.browserAction.setTitle({
    title: isEnabled ? 'CSP is disabled' : 'CSP is enabled (click to disable)'
  });
});

// Initialize as enabled for testing
isEnabled = true;
console.log('[disable-CSP] Extension loaded and enabled'); 