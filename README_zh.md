# ChatterUI - 一个简单的大语言模型应用

[中文](README_zh.md) | [English](README.md)

ChatterUI 是一个原生移动端大语言模型前端应用。

在设备上运行大语言模型或连接到各种商业或开源 API。ChatterUI 旨在提供一个移动端友好的界面，并对聊天结构进行精细控制。

如果您喜欢这个应用，请随时在这里支持我：

<a href='https://ko-fi.com/W7W7X8T7W' target='_blank'><img height='42' style='border:0px;height:42px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

<div>
与角色或助手聊天
<br/>                           
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/characterlist.png" width="150" > 
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/chat.png" width="150" > 
<br/>
使用设备本地模型或 API
<br/>
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/models.png" width="150" > 
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/api.png" width="150" > 
<br/>
修改和自定义
<br/>
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/charactereditor.png" width="150" > 
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/settings.png" width="150" >
<br/>
个性化设置
<br/>
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/usereditor.png" width="150" > 
<img src ="https://github.com/Vali-98/ChatterUI/blob/master/assets/screenshots/userlist.png" width="150" >
</div>

## 功能特性:

-   在本地模式下在设备上运行大语言模型
-   在远程模式下连接到各种 API
-   与角色聊天（支持 Character Card v2 规范）
-   为每个角色创建和管理多个聊天
-   自定义采样器字段和指令格式
-   与您设备的文本转语音（TTS）引擎集成

<br/>

# 使用方法

从[发布页面](https://github.com/Vali-98/ChatterUI/releases/latest)下载并安装最新的 APK。

<i>由于缺乏用于开发的 iOS 硬件，iOS 版本目前不可用</i>

## 本地模式

ChatterUI 底层使用 [llama.cpp](https://github.com/ggerganov/llama.cpp) 在设备上运行 gguf 文件。使用自定义适配器与 react-native 集成：[cui-llama.rn](https://github.com/Vali-98/cui-llama.rn)

要使用设备本地推理，首先启用本地模式，然后进入模型 > 导入模型 / 使用外部模型，选择一个能够适配您设备内存的 gguf 模型。导入功能如下：

-   导入模型：将模型文件复制到 ChatterUI 中，可能会提高启动时间。
-   使用外部模型：直接使用设备存储中的模型，无需将大文件复制到 ChatterUI 中，但加载时间会稍有延迟。

之后，您可以加载模型并开始聊天！

_注意：对于搭载骁龙 8 Gen 1 及以上或 Exynos 2200+ 的设备，建议使用 Q4_0 量化以获得优化性能。_

## 远程模式

远程模式允许您连接到商业和开源项目的一些常见 API。

### 开源后端:

-   koboldcpp
-   text-generation-webui
-   Ollama

### 专用 API:

-   OpenAI
-   Claude _（支持使用代理）_
-   Cohere
-   Open Router
-   Mancer
-   AI Horde

### 通用后端:

-   通用文本补全
-   通用聊天补全

_这些应该与任何文本补全/聊天补全后端兼容，如 Groq 或 Infermatic。_

### 自定义 API:

缺少您的 API 提供商？ChatterUI 允许您使用其模板系统定义 API。

在[这里](https://github.com/Vali-98/ChatterUI/discussions/126)了解更多信息！

## 开发

### Android

要运行开发构建，请按照以下简单步骤操作：

-   安装您选择的任何 Java 17/21 SDK
-   通过 `Android Studio` 安装 `android-sdk`
-   克隆仓库：

```
git clone https://github.com/Vali-98/ChatterUI.git
```

-   通过 npm 安装依赖项并通过 Expo 运行：

```
npm install
npx expo run:android
```

#### 构建 APK

需要 Node.js、Java 17/21 SDK 和 Android SDK。Expo 使用 EAS 构建应用，这需要 Linux 环境。

1. 克隆仓库。
2. 将 `eas.json.example` 重命名为 `eas.json`。
3. 将 `"ANDROID_SDK_ROOT"` 修改为您的 Android SDK 目录
4. 运行以下命令：

```
npm install
eas build --platform android --local
```

### IOS

目前正在开发中

## 致谢

-   [llama.cpp](https://github.com/ggerganov/llama.cpp) - 运行大语言模型的底层引擎
-   [llama.rn](https://github.com/mybigday/llama.rn) - 原始的 react-native llama.cpp 适配器