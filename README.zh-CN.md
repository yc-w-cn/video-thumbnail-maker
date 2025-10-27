# 视频缩略图生成器

[English](./README.md) | 简体中文

一个简单易用的视频缩略图生成工具，可以快速从视频中提取多个画面并生成预览图。

![预览图](./public/preview.png)

## 生成效果

![生成效果](./public/thumbnails.jpg)

## 功能特性

- 🎬 支持多种视频格式
- 🖼️ 自定义缩略图数量和大小
- 📐 灵活的布局配置
- 🚀 快速批量处理
- 🎯 简单直观的拖放操作
- 🌓 支持深色模式
- 💾 自动保存设置
- 📊 实时处理进度显示
- 🌍 支持中英文双语界面
- 📋 处理列表支持批量操作
- 🎞️ 支持生成缩略图动画（GIF）

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
3. 将视频文件拖放到应用窗口中，文件会自动添加到处理列表
4. 使用处理列表管理多个文件：
   - 查看每个文件的处理状态（待处理、处理中、已完成、错误）
   - 从列表中移除单个文件
   - 清空整个列表
   - 批量处理所有文件
5. 处理完成后，可以在指定的输出目录找到生成的预览图

## 开发相关

本项目使用以下技术栈：

- Tauri - 跨平台应用框架
- React - 前端UI框架
- TypeScript - 类型安全的JavaScript超集
- Tailwind CSS - 实用优先的CSS框架
- i18next - 强大的国际化解决方案

### 开发环境设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm tauri dev

# 构建应用
pnpm tauri build
```

### 国际化开发

本项目使用 i18next 进行国际化支持，语言文件位于 `src/i18n` 目录下。如需添加新的语言支持，请按照以下步骤操作：

1. 在 `src/i18n` 目录下创建新的语言文件
2. 在 `src/i18n/i18next.ts` 中注册新语言
3. 使用 `useTranslation` hook 在组件中实现文本翻译

## 许可证

MIT License