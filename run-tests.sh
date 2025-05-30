#!/bin/bash

echo "🚀 Chrome Extension Security Testing Suite"
echo "========================================"

# 检查chrome-mac目录是否存在
if [ ! -d "chrome-mac" ]; then
    echo "❌ Error: chrome-mac directory not found!"
    echo "Please download Chromium 109 and extract to chrome-mac/"
    exit 1
fi

# 清理旧的测试结果
echo "🧹 Cleaning old test results..."
npm run clean

# 启动测试
echo "🏃 Starting automated tests..."
npm run test-all

# 生成报告
echo "📊 Generating test report..."
npm run report

echo "✅ Testing complete! Check results/report.md for detailed report." 