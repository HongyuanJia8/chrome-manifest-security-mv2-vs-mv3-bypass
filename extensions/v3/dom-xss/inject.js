// Directly inject malicious script
const s = document.createElement('script');
s.textContent = `
  alert('XSS executed!');
  console.log('[dom-xss] XSS attack successful');
`;
document.documentElement.appendChild(s);
