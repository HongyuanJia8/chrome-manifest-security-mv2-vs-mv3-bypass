// CORS Unblock - MV2 Version
console.log('[CORS-Unblock] Extension loaded');

// Modify CORS headers on all requests
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    console.log('[CORS-Unblock] Processing headers for:', details.url);
    
    const responseHeaders = details.responseHeaders || [];
    
    // Find existing CORS headers
    let hasAccessControlOrigin = false;
    
    for (let i = 0; i < responseHeaders.length; i++) {
      const header = responseHeaders[i];
      const name = header.name.toLowerCase();
      
      // Update Access-Control-Allow-Origin
      if (name === 'access-control-allow-origin') {
        console.log('[CORS-Unblock] Modifying Access-Control-Allow-Origin');
        header.value = '*';
        hasAccessControlOrigin = true;
      }
      
      // Remove X-Frame-Options
      if (name === 'x-frame-options') {
        console.log('[CORS-Unblock] Removing X-Frame-Options');
        responseHeaders.splice(i, 1);
        i--;
      }
    }
    
    // Add Access-Control-Allow-Origin if not present
    if (!hasAccessControlOrigin) {
      console.log('[CORS-Unblock] Adding Access-Control-Allow-Origin header');
      responseHeaders.push({
        name: 'Access-Control-Allow-Origin',
        value: '*'
      });
    }
    
    // Add other CORS headers
    responseHeaders.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH'
    });
    
    responseHeaders.push({
      name: 'Access-Control-Allow-Headers',
      value: '*'
    });
    
    return { responseHeaders: responseHeaders };
  },
  {
    urls: ['<all_urls>'],
    types: ['xmlhttprequest', 'main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
);

console.log('[CORS-Unblock] CORS modification active'); 