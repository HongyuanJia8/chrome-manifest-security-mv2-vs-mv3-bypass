export function attachDetectors(page, pattern) {
  const [type, arg] = pattern.split(':');

  switch (type) {

    case 'network_to':
      // Monitor all requests
      page.on('request', req => {
        console.log(`[DETECTOR] Request: ${req.method()} ${req.url()}`);
      });
      
      page.on('requestfinished', req => {
        const url = req.url();
        console.log(`[DETECTOR] Request finished: ${url}`);
        if (url.includes(arg)) {
          console.log(`[DETECTOR] Network request to ${arg} detected!`);
          page.___attackSuccess = true;
        }
      });
      
      page.on('requestfailed', req => {
        console.log(`[DETECTOR] Request failed: ${req.url()} - ${req.failure().errorText}`);
      });
      break;

    case 'console_contains':
      page.on('console', msg => {
        const text = msg.text();
        console.log(`[DETECTOR] Console message: ${text}`);
        if (text.includes(arg)) {
          console.log(`[DETECTOR] Attack success - matched "${arg}"`);
          page.___attackSuccess = true;
        }
      });
      break;

    case 'dialog_alert':
      page.on('dialog', async dialog => {
        console.log(`[DETECTOR] Alert dialog detected: ${dialog.message()}`);
        await dialog.dismiss();         
        page.___attackSuccess = true;
      });
      break;

    case 'cookie_read_from':      
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes(`cookies.getAll`) && text.includes(arg)) {
          console.log(`[DETECTOR] Cookie theft detected for domain: ${arg}`);
          page.___attackSuccess = true;
        }
      });
      break;

    default:
      console.warn('Unknown detector', pattern);
  }
}
