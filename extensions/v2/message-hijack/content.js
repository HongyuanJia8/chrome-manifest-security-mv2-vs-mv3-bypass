window.addEventListener('message', e => {
  chrome.runtime.sendMessage(e.data, resp => {
    window.postMessage(resp, '*');
  });
});
