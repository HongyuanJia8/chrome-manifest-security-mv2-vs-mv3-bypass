# Cookie Hijacking Malicious Chrome Extension

This was developed as a proof of concept for stealing cookies through a malicious
chrome extension. Goal is to at random intervals after rest, query all cookies
and send them unsuspiciously to a separate server where cookies of multiple
users are installed.

Proof we can hijack user sessions and alter the effectiveness of 2FA apps. This
extension uses strong permissions which should be seen as a red-flag when 
downloading an extension - please get your chrome extensions from the official 
google webstore and revise the permissions they require!

[@tareqdandachi] developed the extension source and [@ashika-verma] developed the
server where scraped data is stored.

## Potential ways of getting on the chrome store

To pass security checks from google chrome store [pass manual and automatic checks]:

- minification
- change variable names
- make sure we follow legal instructions to not raise suspicion (no `eval()`, outside js scripts)
- minimize number and sensitivity of permissions
- hide sketchy services inside nice ones, i.e. bug report
- idle time, make the extension not run for some time after installation, this will confuse scrapers
- minimize number of requests we send through randomization and timing
- ideally send requests when the user wants to send a request.
- be very clear about what our app does (ofc skipping the malicioius part)
- post a privacy policy
- "An extension must have a single purpose that is narrow and easy-to-understand"

See [Deceptive Installation Tactics FAQ](https://developer.chrome.com/docs/webstore/deceptive_installation_tactics/) and [Developer Program Policies](https://developer.chrome.com/docs/webstore/program_policies/)

#### Separately we need to look into compliant disclosure

> A disclosure must include two components, along with any additional information the developer considers necessary for the user.
> The fact that a user will be installing a Chrome browser extension.
> What the extension does. Content in both the marketing and installation flow of an extension must clearly outline both the principal and significant features of your extension. Burying this information in unrelated text is considered a violation of this policy.
> In addition to including these components, the disclosure must comply with the following:
> Disclosures must be in readable text and utilize contrast to ensure the disclosure is legible. Disclosures in an image or audio form must be accompanied by a text disclosure.
> The disclosure must be above and clearly associated with the first link or button that leads to the Chrome Web Store.

## Extension Facade

We need to mask our extension with things that require access to cookies and send requests.
Ideally it would require the same permissions if we were to engineer it that way. It would be
nice if we can make the user interact and ask for requests from the server.

Possible masking:
- encrypter app for extra security (this is cool because the user will often send requests and we can mask our work with them)
- memey canvas to lmod
- cookie clearing
