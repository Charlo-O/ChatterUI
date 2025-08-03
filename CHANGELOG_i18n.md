# 国际化功能变更日志

## 新增功能

### 1. 多语言支持
- 添加了英文 (en) 和中文 (zh) 两种语言支持
- 自动检测设备语言并设置默认语言
- 支持运行时语言切换

### 2. 翻译文件
- 创建了 `app/locales/en/translation.json` (英文翻译)
- 创建了 `app/locales/zh/translation.json` (中文翻译)
- 包含以下翻译类别：
  - 通用文本 (common)
  - 身份验证 (auth)
  - 数据库 (database)
  - 角色管理 (characters)
  - 对话功能 (chat)
  - 设置菜单 (settings)
  - 菜单项 (menu)
  - 开发模式 (dev)
  - 错误信息 (errors)

### 3. 国际化配置
- 创建了 `lib/i18n/index.ts` 国际化配置文件
- 使用 i18next 和 react-i18next 库
- 集成了 expo-localization 自动检测设备语言

### 4. 自定义 Hook
- 创建了 `lib/hooks/useTranslation.tsx` 自定义翻译 Hook
- 提供类型安全的翻译功能
- 支持语言切换和当前语言获取

### 5. 语言切换组件
- 创建了 `app/screens/SettingsDrawer/LanguageToggle.tsx` 语言切换组件
- 集成到设置抽屉中
- 显示当前语言和切换按钮

### 6. 更新的组件
以下组件已更新以支持国际化：
- `app/index.tsx` - 主页面
- `app/screens/CharacterMenu/CharactersEmpty.tsx` - 角色列表空状态
- `app/screens/CharacterMenu/CharactersSearchEmpty.tsx` - 角色搜索空状态
- `app/screens/SettingsDrawer/RouteList.tsx` - 设置路由列表
- `app/screens/SettingsDrawer/index.tsx` - 设置抽屉

### 7. 测试页面
- 创建了 `app/screens/I18nTest.tsx` 国际化测试页面
- 可以测试所有翻译功能和语言切换

## 安装的依赖

```json
{
  "i18next": "^23.x.x",
  "react-i18next": "^14.x.x"
}
```

## 使用方法

### 在组件中使用翻译
```tsx
import { useTranslation } from '@lib/hooks/useTranslation'

const MyComponent = () => {
    const { t } = useTranslation()
    return <Text>{t('common.save')}</Text>
}
```

### 切换语言
```tsx
import { useTranslation } from '@lib/hooks/useTranslation'

const LanguageSwitcher = () => {
    const { changeLanguage } = useTranslation()
    
    const switchToChinese = () => changeLanguage('zh')
    const switchToEnglish = () => changeLanguage('en')
}
```

## 配置更新

### i18next-scanner 配置
更新了 `i18next-scanner.config.js` 以支持中文语言：
```javascript
lngs: ['en', 'zh']
```

### 应用入口
在 `app/_layout.tsx` 中导入了国际化配置：
```tsx
import '../lib/i18n'
```

## 文档

- 创建了 `docs/Internationalization.md` 详细使用说明
- 包含所有翻译键的完整列表
- 提供了使用示例和最佳实践

## 测试

可以通过以下方式测试国际化功能：
1. 启动应用
2. 打开设置抽屉
3. 点击语言切换按钮
4. 访问 `/screens/I18nTest` 页面查看完整测试

## 注意事项

1. 所有硬编码的文本都应该使用翻译函数
2. 添加新文本时，需要同时更新英文和中文翻译文件
3. 语言设置会在应用重启后保持
4. 默认语言基于设备语言设置，如果没有对应翻译则回退到英文 