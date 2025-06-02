# Chrome Extension Manifest V2 vs V3 Security Analysis

A comprehensive security analysis comparing Chrome Extension Manifest V2 and V3 through automated testing of various malicious extension types. This research evaluates the effectiveness of Manifest V3's security improvements against real-world attack vectors.

## 🔍 Project Overview

This project systematically tests the security implications of Chrome's transition from Manifest V2 to V3 by implementing and testing various types of malicious extensions across both manifest versions. Our automated testing framework reveals which attacks are successfully blocked by MV3's security enhancements and which vulnerabilities remain exploitable.

## Quick Start

### Prerequisites

- **Node.js** (v20+) and npm
- **Chrome/Chromium** browser (version 109.0.5413.2 recommended for testing)
- **macOS** (tested on macOS, may work on other platforms)

### Installation

```bash


# Install dependencies
npm install

# Download Chrome/Chromium for testing(It depends on the platform you use)
# Visit: https://vikyd.github.io/download-chromium-history-version/
# Download version 109.0.5413.2 and extract to ./chrome-mac/
```

### Basic Usage

```bash
# Run comprehensive security test (recommended)
./run-server-test.sh

# Quick test (1 round per extension)
./run-server-test.sh quick

# Test specific extension
npm run test -- --ext cookie-hijacker --mode v2

# Start test server for manual testing
npm run server
```

## 🔬 Malicious Extensions Tested

Our test suite includes 6 different types of malicious extensions, each targeting different attack vectors:

### 1. **Cookie Hijacker** 🍪
- **Attack Vector**: Steals cookies from all visited websites
- **Implementation**: Uses `chrome.cookies.getAll()` API to access browser cookies
- **MV2 vs MV3**: Both versions can succeed if proper permissions are granted
- **Files**: `extensions/v2/cookie-hijacker/`, `extensions/v3/cookie-hijacker/`

### 2. **Keylogger** ⌨️
- **Attack Vector**: Captures keystrokes on all web pages
- **Implementation**: Content script monitors `document.onkeypress` events
- **MV2 vs MV3**: Identical functionality - content scripts retain full DOM access
- **Files**: `extensions/v2/keylogger/`, `extensions/v3/keylogger/`

### 3. **Eval Loader** 💉
- **Attack Vector**: Downloads and executes remote JavaScript code
- **Implementation**: Fetches payload from remote server and uses `eval()` to execute
- **MV2 vs MV3**: **MV3 blocks this attack** - CSP prevents `unsafe-eval`
- **Files**: `extensions/v2/eval-loader/`, `extensions/v3/eval-loader/`

### 4. **DOM XSS Injector** 🔧
- **Attack Vector**: Injects malicious scripts into web pages
- **Implementation**: Content script creates and appends `<script>` elements
- **MV2 vs MV3**: **MV3 blocks this attack** - CSP prevents inline script execution
- **Files**: `extensions/v2/dom-xss/`, `extensions/v3/dom-xss/`

### 5. **Header Modifier** 🛡️
- **Attack Vector**: Modifies HTTP headers to bypass security policies
- **Implementation**: 
  - **MV2**: Uses `webRequest` API to modify headers
  - **MV3**: Uses `declarativeNetRequest` to remove/modify CSP headers
- **MV2 vs MV3**: **Partial success in MV3** - Can still modify headers and use HTML event handlers
- **Files**: `extensions/v2/modify-header/`, `extensions/v3/modify-header/`

### 6. **Message Hijacker** 📨
- **Attack Vector**: Intercepts and manipulates postMessage communications
- **Implementation**: Listens for window messages and responds with sensitive data
- **MV2 vs MV3**: **MV3 restricts this attack** - Service worker limitations reduce effectiveness
- **Files**: `extensions/v2/message-hijack/`, `extensions/v3/message-hijack/`

##  Testing Framework

### Server-Based Detection System

Our testing framework uses a novel server-based detection system that monitors actual HTTP requests to determine attack success, providing more accurate results than client-side detection alone.

#### Detection Criteria

| Extension | Detection Method | Success Indicator |
|-----------|------------------|-------------------|
| Cookie Hijacker | Server logs | `POST /stolen` with cookie data |
| Keylogger | Server logs | `POST /stolen` with keystroke data |
| Eval Loader | Server logs | `GET /payload.js` requests |
| Header Modifier | Server logs + Page execution | `GET /config` + payload execution |
| DOM XSS | Page alerts/console | JavaScript alert dialogs |
| Message Hijacker | Server logs | `GET /test/message-hijack` + data theft |

#### Test Server Endpoints

The automated test server provides:
- `http://localhost:8000/payload.js` - Malicious JavaScript payload
- `http://localhost:8000/config` - Configuration for dynamic attacks
- `http://localhost:8000/stolen` - Data exfiltration endpoint
- `http://localhost:8000/test/message-hijack` - Message hijacking test page



## ⚠️ Disclaimer

This research is conducted for educational and security research purposes only. The malicious extensions included in this repository are proof-of-concept implementations designed to evaluate browser security mechanisms. Do not use these techniques for malicious purposes.

