#!/bin/bash

echo "🚀 Chrome Extension Manual Testing"
echo "================================="

# Function to test an extension
test_extension() {
    local name=$1
    local path=$2
    local mode=$3
    
    echo ""
    echo "📝 Testing $name ($mode)"
    echo "Extension path: $path"
    
    if [ "$mode" = "v2" ]; then
        CHROME_BIN="./chrome-mac/Chromium.app/Contents/MacOS/Chromium"
    else
        CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    fi
    
    echo "Opening Chrome with extension..."
    "$CHROME_BIN" \
        --disable-extensions-except="$path" \
        --load-extension="$path" \
        --no-sandbox \
        --new-window \
        https://example.com &
    
    CHROME_PID=$!
    
    echo "✅ Chrome opened with PID: $CHROME_PID"
    echo ""
    echo "📌 Please check manually:"
    echo "   - For DOM-XSS: Check if alert popup appears"
    echo "   - For cookie-hijacker: Check network tab for requests to localhost:8000"
    echo "   - For keylogger: Type something and check network tab"
    echo "   - For eval-loader: Check console for 'Executed remote payload'"
    echo "   - For message-hijack: Check console for 'cookies.getAll'"
    echo ""
    read -p "Press Enter when done testing..."
    
    kill $CHROME_PID 2>/dev/null
}

# Start test server
echo "Starting test server..."
npm run server &
SERVER_PID=$!
sleep 2

# Test each extension
test_extension "dom-xss" "$(pwd)/extensions/v2/dom-xss" "v2"
test_extension "cookie-hijacker-v2" "$(pwd)/extensions/v2/cookie-hijacker-v2" "v2"
test_extension "keylogger" "$(pwd)/extensions/v2/keylogger/extension" "v2"
test_extension "eval-loader" "$(pwd)/extensions/v2/eval-loader" "v2"
test_extension "message-hijack" "$(pwd)/extensions/v2/message-hijack" "v2"

# Kill test server
echo ""
echo "Stopping test server..."
kill $SERVER_PID 2>/dev/null

echo "✅ Testing complete!" 