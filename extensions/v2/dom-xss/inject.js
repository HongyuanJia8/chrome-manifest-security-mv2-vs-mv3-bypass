const s = document.createElement('script');
s.src = 'https://localhost:8000/domxss.js'; 
document.documentElement.appendChild(s);
console.log('[dom-xss] injected external script');
