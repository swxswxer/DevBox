<div align="center">

<img src="./assets/icon.png" alt="DevBox Logo" width="128" height="128">

# DevBox
 一款功能高度集成、界面精美的开发桌面工具集，集成多种开发常用工具：加密工具（MD5/Base64/国密SM3/URL编码）、格式化工具（JSON/XML）、文本比对工具、二维码生成等。操作便捷，为开发者提升工作效率。


[![Release](https://img.shields.io/github/v/release/swxswxer/Devbox?style=flat-square&logo=github&color=blue&label=Release)](https://github.com/swxswxer/Devbox/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square&logo=opensourceinitiative&logoColor=white)](https://github.com/swxswxer/Devbox/blob/master/LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square&logo=wails&logoColor=white)](https://github.com/swxswxer/Devbox/releases)


[![Vue](https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Wails](https://img.shields.io/badge/Wails-Go-00add8?style=flat-square&logo=go&logoColor=white)](https://wails.io/)



[![Downloads](https://img.shields.io/github/downloads/swxswxer/Devbox/total?style=flat-square&logo=github&label=Downloads&color=brightgreen)](https://github.com/swxswxer/Devbox/releases)
[![Stars](https://img.shields.io/github/stars/swxswxer/Devbox?style=flat-square&logo=github&label=Stars)](https://github.com/swxswxer/Devbox/stargazers)
[![Forks](https://img.shields.io/github/forks/swxswxer/Devbox?style=flat-square&logo=github&label=Forks)](https://github.com/swxswxer/Devbox/network/members)
[![Issues](https://img.shields.io/github/issues/swxswxer/Devbox?style=flat-square&logo=github&label=Issues)](https://github.com/swxswxer/Devbox/issues)
[![Last Commit](https://img.shields.io/github/last-commit/swxswxer/Devbox?style=flat-square&logo=github&label=Last%20Commit)](https://github.com/swxswxer/Devbox/commits)

</div>

## 快速开始
### 方式一：下载发布版（推荐）
直接下载已编译好的可执行文件，**无需安装依赖**：
- **[Releases 下载](https://github.com/swxswxer/DevBox/releases)**

支持平台及预编译版本说明

- ✅Windows 、✅MacOS

| 平台 | 架构 | 文件名 |
|------|------|--------|
| Windows | x64 (64位) | DevBox_windows_x64.exe |
| macOS | x64 (Intel) | DevBox_macos_x64.dmg |
| macOS | arm64 (Apple Silicon) | DevBox_macos_arm64.dmg |
### 方式二：从源代码构建（需要 Go 环境）

#### 环境要求

- Node.js >= 16
- Go >= 1.18 (Wails)
- macOS / Windows / Linux

#### 本地开发

```bash
# 启动 Wails 开发模式（需要 Go 环境）
wails dev
```

#### 构建

```bash
# 构建 Wails 应用
wails build
```


## 功能模块

### 🔐 加密工具

#### MD5 和 Base64
- **功能**：支持 MD5 哈希、Base64 编码、MD5+Base64 组合加密
- **特性**：
    - MD5 支持大写/小写输出切换
    - 一键复制加密结果
    - 实时预览加密输出
- **依赖**：`blueimp-md5`

#### HMAC-SM3
- **功能**：国密 HMAC-SM3 摘要加密，输出 Base64 编码
- **特性**：
    - 支持自定义密钥
    - 遵循 RFC 2104 标准实现
    - 适用于国密场景的数据完整性验证
- **依赖**：`gm-crypto`

#### URL 编码解码
- **功能**：URL 编码（encode）和解码（decode）转换
- **特性**：
    - 支持 URL 编码和解码双向转换
    - 支持中文等特殊字符编码
    - 一键交换输入输出内容
    - 一键复制结果
- **依赖**：原生 JavaScript API

### 📝 格式化工具

#### JSON/XML 格式化
- **功能**：JSON 和 XML 格式化与压缩
- **特性**：
    - 自动识别 JSON/XML 格式
    - 支持格式化（美化）与压缩（最小化）切换
    - 支持 Key 按 ASCII 排序
    - 语法高亮显示
    - 错误提示与格式校验
- **依赖**：`highlight.js`、`fast-xml-parser`

### 🔍 比对工具

#### 文本比对
- **功能**：两段文本的差异对比
- **特性**：
    - 并排显示原始文本与新文本
    - 高亮显示新增、删除、修改的内容
    - 支持行级、字符级差异对比
- **依赖**：`v-code-diff`

### 🖼️ 其他工具

#### 地址转二维码
- **功能**：URL 地址生成二维码
- **特性**：
    - 支持任意 URL 或文本生成二维码
    - 右键保存二维码图片
    - 自定义二维码尺寸
- **依赖**：`qrcode`

## 依赖说明

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| `vue` | ^3.2.37 | 前端框架 |
| `element-plus` | ^2.13.2 | UI 组件库 |
| `blueimp-md5` | ^2.19.0 | MD5 加密算法 |
| `gm-crypto` | ^0.1.12 | 国密算法（SM2/SM3/SM4），用于 HMAC-SM3 |
| `qrcode` | ^1.5.4 | 二维码生成 |
| `v-code-diff` | ^1.13.1 | 文本差异对比 |
| `highlight.js` | ^11.9.0 | 代码语法高亮，用于 JSON/XML 格式化 |
| `fast-xml-parser` | ^4.3.2 | XML 解析与构建 |

## 项目结构

```
frontend/
├── src/
│   ├── components/           # 组件目录
│   │   ├── JsonFormatter.vue # JSON/XML 格式化
│   │   ├── TextDiff.vue      # 文本比对
│   │   ├── Md5AndBase64.vue  # MD5/Base64 加密
│   │   ├── HmacSm3.vue       # HMAC-SM3 加密
│   │   ├── UrlEncode.vue     # URL 编码解码
│   │   ├── ImagePreview.vue  # 图片预览
│   │   ├── QRCodeGenerator.vue # 二维码生成
│   │   └── HelloWorld.vue    # 示例组件
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── package.json
└── vite.config.js
```

## 常见问题
1.MacOS提示应用程序已损坏，无法打开。
在终端中执行以下命令：
```bash
sudo xattr -dr com.apple.quarantine /Applications/DevBox.app
```
然后再次运行应用程序。

<div align="center">

## 支持项目

如果这个项目对你有帮助，欢迎通过以下方式支持：

- 给项目一个 ⭐ Star
- 分享给更多需要的人
- 提交 Issue 和 Pull Request
</div>