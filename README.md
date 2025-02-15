# 视频缩略图生成器

一个简单易用的视频缩略图生成工具，可以快速从视频中提取多个画面并生成预览图。

![预览图](./public/preview.jpg)

## 功能特性

- 🎬 支持多种视频格式
- 🖼️ 自定义缩略图数量和大小
- 📐 灵活的布局配置
- 🚀 快速批量处理
- 🎯 简单直观的拖放操作

## 系统要求

使用本工具需要安装以下依赖：

- FFmpeg - 用于视频处理和帧提取
- ImageMagick - 用于图片合成

### 安装依赖

**macOS**:
```bash
brew install ffmpeg imagemagick
```

**Windows**:
1. FFmpeg: 从 [FFmpeg官网](https://ffmpeg.org/download.html) 下载并添加到系统环境变量
2. ImageMagick: 从 [ImageMagick官网](https://imagemagick.org/script/download.php) 下载安装程序

**Linux**:
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg imagemagick

# CentOS/RHEL
sudo yum install ffmpeg imagemagick
```

## 使用说明

1. 启动应用后，首先会检查系统是否安装了必要的依赖（FFmpeg和ImageMagick）
2. 设置生成参数：
   - 截图数量：决定从视频中提取多少张画面
   - 缩略图宽度：设置每个缩略图的宽度（高度会按比例自动调整）
   - 每行数量：设置最终合成图片每行显示的缩略图数量
3. 将视频文件拖放到应用窗口中开始处理
4. 处理完成后，可以在指定的输出目录找到生成的预览图

## 开发相关

本项目使用以下技术栈：

- Tauri - 跨平台应用框架
- React - 前端UI框架
- TypeScript - 类型安全的JavaScript超集
- Tailwind CSS - 实用优先的CSS框架

### 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm tauri dev

# 构建应用
pnpm tauri build
```

## 许可证

MIT License
