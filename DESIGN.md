# Liquid Glass UI

## Approved direction

The requested reference is Appllama/liquid-glass-chat-ui, first cookbook Fable.
Use its cool neutral canvas, circular portraits/actions, rounded conversation
panel, solid outgoing bubbles, light incoming bubbles, and floating two-row
glass composer. The reference screenshots are in extra/liquid-glass-chat-ui/docs/images.
This explicit direction supersedes the earlier flat Astryx visual treatment.

## System

- Theme source: lib/theme/LiquidGlassTheme.ts, exposed through Theme.useTheme().glass.
- Existing Astryx semantic exports remain compatibility adapters for all screens.
- System typography, message body 17/23 by default; preserve user font preferences.
- Bubble radius 26, card 28, conversation panel 40, circular actions at least 44dp.
- Blue is reserved for status/selection. Main actions and outgoing messages are neutral.
- Glass is limited to floating controls, navigation and overlays. Messages remain legible.
- Light and dark appearance follow existing settings; custom ThemeColor storage is preserved.
- Keep the native keyboard, streaming, Markdown, attachments, editing, swipes and TTS paths.
- No sample contacts, simulated replies, fake unread badges or unavailable call/record buttons.

## Platform treatment

Use expo-glass-effect where iOS Liquid Glass is available. Provide a translucent
blur surface on web/older iOS and a contrast-preserving surface on Android.
Native builds must be rebuilt after adding Expo native packages.
Do not upgrade the app's Expo SDK to copy the reference's newer runtime.
Portrait refraction and iOS-only photo transitions are not claimed as identical
on Android/web. Respect Reduce Transparency and Reduce Motion.
