#!/bin/bash

echo "🚀 Chrome Extension Security Testing Suite"
echo "========================================"

if [ ! -d "chrome-mac" ]; then
    echo "❌ Error: chrome-mac directory not found!"
    echo "Please download Chromium 109 and extract to chrome-mac/"
    exit 1
fi

echo "🧹 Cleaning old test results..."
npm run clean

echo "🏃 Starting automated tests..."
npm run test-all

echo "📊 Generating test report..."
npm run report

echo "✅ Testing complete! Check results/report.md for detailed report." 