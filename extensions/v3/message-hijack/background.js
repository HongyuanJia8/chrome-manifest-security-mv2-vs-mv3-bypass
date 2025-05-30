// Converted to MV3 Service Worker
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'getCookies' && req.domain) {
    console.log('cookies.getAll', req.domain);  
    chrome.cookies.getAll({ domain: req.domain }, cookies => {
      sendResponse({ cookies });
    });
    return true;  // keep channel open for async
  }
});
