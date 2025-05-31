#!/bin/bash

echo "🚀 Chrome Extension Security Test - Server-based Detection"
echo "======================================================="
echo ""
echo "This test monitors actual server requests to determine attack success."
echo "Much more accurate than client-side detection!"
echo ""

# Check if another server is running on port 8000
if lsof -i:8000 > /dev/null 2>&1; then
    echo "⚠️  Port 8000 is already in use. Killing existing process..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 1
fi

echo "📊 Running server-based tests..."
echo ""

# Run the test
if [ "$1" == "quick" ]; then
    # Quick test - 1 run each
    npm run server-test -- --mode both --count 1
else
    # Full test - 3 runs each
    npm run server-test -- --mode both --count 3
fi

# Generate report
echo ""
echo "📊 Generating report..."
npm run report

echo ""
echo "✅ Testing completed!"
echo ""
echo "View results:"
echo "  - Summary: See above"
echo "  - Detailed report: results/report.md"
echo "  - Raw data: results/raw/*.csv" 