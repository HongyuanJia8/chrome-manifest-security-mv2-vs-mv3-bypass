#!/bin/bash

echo "🚀 Chrome Extension Security Testing Suite - Full Test"
echo "===================================================="

if [ ! -d "chrome-mac" ]; then
    echo "❌ Error: chrome-mac directory not found!"
    echo "Please download Chromium 109 and extract to chrome-mac/"
    exit 1
fi

echo "🧹 Cleaning old test results..."
npm run clean

echo "🔄 Converting extensions to Manifest V3..."
npm run convert

echo "📝 Updating test configuration..."

echo "🏃 Starting automated tests..."
npm run test-all

echo "📊 Generating test report..."
npm run report

echo "✅ Testing complete! Check results/report.md for detailed report."
echo ""
echo "📈 Key findings will show:"
echo "  - Which attacks work in MV2 vs MV3"
echo "  - Effectiveness of MV3's CSP protection"
echo "  - Remaining vulnerabilities in MV3" 