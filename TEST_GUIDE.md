# Chrome Extension Security Testing Guide

## 项目概述

这是一个Chrome扩展安全测试框架，用于对比Manifest V2和V3在防御恶意扩展方面的效果。

## 测试扩展列表

1. **cookie-hijacker-v2**: 窃取所有cookies并发送到攻击者服务器
2. **keylogger**: 记录用户键盘输入
3. **eval-loader**: 从远程服务器加载并执行恶意代码
4. **message-hijack**: 通过postMessage API进行权限提升攻击
5. **dom-xss**: 注入恶意脚本到页面DOM

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 下载Chromium 109 (支持MV2)
- 访问 https://vikyd.github.io/download-chromium-history-version/
- 下载版本 109.0.5413.2 (Mac版本)
- 解压到项目根目录，重命名为 `chrome-mac`

### 3. 一键运行所有测试
```bash
./run-tests.sh
```

### 4. 单独运行测试组件

#### 启动测试服务器（用于eval-loader）
```bash
npm run server
```

#### 运行单个扩展测试
```bash
npm run test -- --ext cookie-hijacker --mode v2
```

#### 运行所有测试
```bash
npm run test-all
```

#### 生成测试报告
```bash
npm run report
```

## 测试原理

### 检测机制
- **network_to**: 检测是否有网络请求发送到特定域名
- **console_contains**: 检测控制台是否包含特定文本
- **dialog_alert**: 检测是否弹出alert对话框
- **cookie_read_from**: 检测是否读取了特定域名的cookies

### 测试流程
1. 启动Puppeteer控制的Chrome浏览器
2. 加载恶意扩展
3. 导航到触发URL
4. 等待攻击执行
5. 通过检测器判断攻击是否成功
6. 记录结果到CSV文件

## 文件结构
```
.
├── extensions/
│   └── v2/                      # MV2恶意扩展
│       ├── cookie-hijacker-v2/
│       ├── keylogger/
│       ├── eval-loader/
│       ├── message-hijack/
│       └── dom-xss/
├── runner/
│   ├── test-runner.js          # 单个测试运行器
│   ├── test-all.js            # 批量测试运行器
│   ├── test-server.js         # 测试服务器
│   ├── generate-report.js     # 报告生成器
│   ├── config.json            # 测试配置
│   └── utils/
│       ├── detectors.js       # 攻击检测器
│       └── launchers.js       # 浏览器启动配置
├── results/
│   ├── raw/                   # 原始CSV测试结果
│   └── report.md              # 生成的测试报告
└── chrome-mac/                # Chromium 109浏览器

```

## 创建MV3版本

要测试MV3的防护效果，需要将MV2扩展转换为MV3格式：

1. 将 `manifest_version` 改为 3
2. 将 `background.scripts` 改为 `background.service_worker`
3. 移除 `persistent: true`
4. 移除所有 `unsafe-eval` 和 `unsafe-inline` CSP
5. 将动态脚本加载改为静态导入

## 注意事项

1. 测试会打开真实的Chrome浏览器窗口
2. 某些恶意行为可能会被系统安全软件拦截
3. 测试服务器需要在8000端口运行
4. 确保chrome-mac目录中的Chromium有执行权限

## 故障排除

### Chrome无法启动
- 检查chrome-mac目录是否存在
- 确保Chromium有执行权限: `chmod +x chrome-mac/Chromium.app/Contents/MacOS/Chromium`

### 扩展加载失败
- 检查manifest.json格式是否正确
- 确保所有必需的文件都存在

### 测试超时
- 增加test-runner.js中的超时时间
- 检查网络连接是否正常 