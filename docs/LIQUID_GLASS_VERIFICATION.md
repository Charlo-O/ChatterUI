# Liquid Glass UI — 实现与验证

验证日期：2026-09-28。

## 范围与参考

- 参考项目已完整克隆到 `extra/liquid-glass-chat-ui`，采用第一套 Fable。
- 参考 revision：`56255e64906ee7b33fac9ae3d4a486f20bb8e258`。
- 嵌套仓库和 `.qa` 不进入父仓库提交或 TypeScript/ESLint 扫描。
- 在工作区已有 Astryx UI 修改上继续实现；未回滚或覆盖既有工作区改动，也未升级主项目 Expo SDK。
- MIT 来源及授权全文见 `THIRD_PARTY_UI.md`；设计规范见根目录 `DESIGN.md`。

## P1：边界

`lib/theme/LiquidGlassTheme.ts` 是新视觉 token 来源。`Theme.useTheme()` 同时暴露 glass 与原有 Astryx adapter，既有页面使用同一套颜色、圆角、按钮、输入框和 Shell。

共享组件位于 `app/components/astryx`、`app/components/liquid`、`app/components/views`。首页改为圆头像和扁平会话行；聊天页采用居中头像导航、40dp 圆角面板、26dp 黑白气泡和双行悬浮 glass composer。设置、模型、连接、格式、采样、用户和角色编辑页面延续共享组件。

Expo Router、SQLite migration gate、角色与用户数据、Zustand 状态、local/remote inference 和自定义主题存储边界保持。参考人物照片、样例联系人和聊天文本未进入生产代码。

## P2：真实链路

`ChatInput.handleSend → Chats.addEntry → SQLite / Zustand → Inference.generateResponse → APIBuilder / SSE → ChatTextLast / Markdown → stopGenerating`。

验收使用隔离浏览器 context `liquid-glass-review` 与仅监听 localhost 的确定性 SSE provider，经过应用真实发送、流式显示、取消和持久化路径。测试 endpoint 和对话仅存在隔离 context，未改动生产连接配置。截图对话是测试 fixture，不是真实模型质量评测。

收尾时已移除隔离 context 的测试连接、关闭 QA 浏览器页并停止 8766 端口的测试服务。8081 端口的 Metro 预览服务保留。

## P3：取舍

- 保留 Expo 55 / RN 0.83，使用兼容版本 expo-glass-effect / expo-blur。
- glass 只用于导航、输入区、Drawer 和 Sheet；消息列表仍虚拟化，避免每条消息 blur。在 10 倍消息量时，首先需要关注流式 Markdown 测量与列表绘制，而不是为全部消息增加玻璃特效。
- iOS 在 API 可用且未启用 Reduce Transparency 时使用原生 GlassView；旧 iOS / Web 使用 blur；Android 使用可读的半透明回退。
- 不宣称 Android / Web 的头像折射、照片过渡或系统玻璃与 iOS 26 参考完全一致。

## 验收中修复的问题

- 稳定列表 viewability callback 和 AnimatedCell 身份，消除发送时 callback-changing 崩溃。
- 修正 glass 背景的叠放顺序，输入文字不再被背景遮住。
- 聊天文字的动画容器使用裁切而非强制 scroll，桌面气泡不再为每条消息显示横纵滚动条；内容高度仍由既有测量动画更新。
- 移除 Markdown body 的全局行高继承，长标题能够正确换行；空代码块不再输出 View 下的空文本。
- Web 消息容器改为 group，避免代码复制按钮嵌套 button；Tab / Enter 仍可展开消息操作。
- composer 随内容在 36–144dp 之间伸缩，清空或删除内容后收缩；Web 单独测量 textarea 自然高度。
- 补齐 RN Web 尚未实现的 submitBehavior：按配置支持 Enter 发送、Shift+Enter 换行，并避开 IME 确认。
- 共享 selector 保留最小高度，Drawer 的 Local / Remote 选项不再被压缩隐藏。
- 无 label 的 ThemedSwitch 使用紧凑宽度，修复连接列表名称被开关挤压、配置逐字竖排的问题；连接卡片改用共享颜色、圆角和受限桌面宽度，验证后的卡片高度为 80dp。
- 系统主题改用稳定 Appearance subscription + useSyncExternalStore，修正同时切换 viewport 与 appearance 后顶栏残留旧颜色。该模式与本地 RN 原生 useColorScheme 实现一致。
- Web-only BackgroundActions adapter 让已有 inference task 在前台运行；native 仍使用原 background service，取消由既有 AbortController 负责。

## 已通过

- `npx tsc --noEmit --pretty false`。
- `npx eslint app db lib --ignore-pattern db/migrations --quiet`，0 errors。未将仓库已有格式 warnings 宣称为全部消除。
- `git diff --check`，使用仓库原有 EOL 配置。
- `npx expo export --platform android --platform ios --output-dir .qa/liquid-glass/native-export`，Android / iOS Hermes bundles 导出成功；这不是 native binary 编译或真机测试。
- 新建聊天、发送、SSE 回复、停止后保留部分文本、重新进入后的消息持久化。
- 短消息编辑保存、键盘展开消息操作、生成第二条 swipe 后 1/2 与 2/2 切换。
- Markdown 标题 / 列表 / 代码块、独立复制按钮无嵌套 button。
- 七行输入扩展至 144dp、删除至单行收缩为 36dp；Enter / Shift+Enter。
- 首页搜索、头像 rail、附件菜单、设置导航和外观切换。
- 桌面连接列表、连接编辑 Sheet、模型管理空态的导航与布局。
- 320px 与 402px 手机视口，深浅模式，无页面横向溢出；刷新后的复测 console 无 error。
- 768px 平板、1440px 桌面聊天均加载真实持久化测试对话；无横向溢出，平板发送按钮可见，桌面 composer 宽度 842px（900px 主面板内）。
- 独立只读审查未发现本轮必须修复的代码问题。

## 本地预览

- `.qa/liquid-glass/preview.png`：浅色 402px 与深色 320px 对照。
- `.qa/liquid-glass/chat-light-402.png`：手机浅色聊天。
- `.qa/liquid-glass/chat-dark-320.png`：手机深色聊天。
- `.qa/liquid-glass/chat-desktop-final-1440.png`：桌面聊天；内容宽度限制为 900dp。
- `.qa` 是本次本地验证产物，不随源码提交。

## 原生验收边界

`adb devices` 未发现连接设备。当前 Windows 环境未进行 iOS 真机或 Android native binary 验收。新增原生 Expo 包后必须重建 App，旧 binary 仅 OTA 更新 JS 不足以加载新模块。

连接 Android 设备后运行 `npm run dev:android`；iOS 需在有 Xcode 的 macOS 上运行 `npm run dev:ios`。设备验收聚焦 glass / Reduce Transparency、键盘与 safe area、相机 / 附件选择，以及后台推理。
