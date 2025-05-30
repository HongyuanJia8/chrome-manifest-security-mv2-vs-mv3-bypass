export function attachDetectors(page, pattern) {
  const [type, arg] = pattern.split(':');

  switch (type) {

    case 'network_to':
      page.on('requestfinished', req => {
        if (req.url().includes(arg)) {
          page.___attackSuccess = true;
        }
      });
      break;

    case 'console_contains':
      page.on('console', msg => {
        if (msg.text().includes(arg)) {
          page.___attackSuccess = true;
        }
      });
      break;

    case 'dialog_alert':
      page.on('dialog', dialog => {
        dialog.dismiss();         
        page.___attackSuccess = true;
      });
      break;

    case 'cookie_read_from':      
      page.on('console', msg => {
        if (msg.text().includes(`cookies.getAll ${arg}`)) {
          page.___attackSuccess = true;
        }
      });
      break;

    default:
      console.warn('Unknown detector', pattern);
  }
}
