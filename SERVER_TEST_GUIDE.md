# Server-based Testing System

## Why This Testing System?

From your server logs, we can clearly see that many attacks were actually successful:
- Multiple `POST /stolen` requests (cookie-hijacker, keylogger)
- `GET /payload.js` requests (eval-loader)
- `GET /config` requests (modify-header)

However, the original client-side detectors failed to capture these attacks due to timing issues.

## Advantages of the New Testing System

1. **Based on Actual Server Requests**: Directly monitors requests received by the server
2. **More Accurate Success Detection**: Based on actual attack behavior
3. **Unified Test Server**: Built-in server, avoids port conflicts

## Usage

### Quick Test (Recommended)
```bash
# Run quick test (1 round each extension)
./run-server-test.sh quick
```

### Full Test
```bash
# Run full test (3 rounds each)
./run-server-test.sh
```

### Manual Run
```bash
# Test specific mode
npm run server-test -- --mode v2 --count 1
npm run server-test -- --mode v3 --count 1
npm run server-test -- --mode both --count 3
```

## Attack Detection Criteria

| Extension | Detection Criteria | Description |
|-----------|-------------------|-------------|
| cookie-hijacker | POST /stolen | Detect cookie data being sent |
| keylogger | POST /stolen | Detect keystroke data being sent |
| eval-loader | GET /payload.js | Detect remote code download attempt |
| modify-header | GET /config + page execution | Detect config download and payload execution |
| message-hijack | GET /test/message-hijack + POST /stolen | Detect message hijacking |
| dom-xss | Page alert or console | Detect XSS execution |

## Expected Results

### MV2 (Should Succeed)
- ✅ cookie-hijacker: ~100%
- ✅ keylogger: ~100%
- ✅ eval-loader: ~100%
- ✅ modify-header: ~80%
- ✅ dom-xss: 100%
- ❓ message-hijack: Depends on implementation

### MV3 (Security Improvements)
- ⚠️ cookie-hijacker: May still succeed (API available)
- ⚠️ keylogger: May still succeed (API available)
- ❌ eval-loader: 0% (CSP blocks eval)
- ⚠️ modify-header: Partial success (HTML event handler)
- ❌ dom-xss: 0% (CSP blocks inline scripts)
- ❌ message-hijack: Service worker restrictions

## Example Output

```
============================================================
Testing cookie-hijacker in V2 mode
============================================================
Navigating to https://example.com...
Waiting for attacks to execute...

📊 Results:
- Server requests: 2
- Attack detected: ✅ YES

Server requests received:
  POST /stolen
```

## Troubleshooting

1. **Port 8000 in use**: Script will auto-clean
2. **Chrome path error**: Check `runner/utils/launchers.js`
3. **Extension load failure**: Verify extension path

## Comparison with Original Test System

| Feature | Original System | Server Test System |
|---------|----------------|-------------------|
| Detection Method | Client-side events | Server requests |
| Accuracy | Timing issues cause misses | Based on actual requests |
| Server | Requires separate start | Built-in test server |
| Result Determination | Complex detectors | Simple request detection | 