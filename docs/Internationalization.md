# 国际化 (Internationalization)

本项目支持多语言，目前支持英文 (en) 和中文 (zh)。

## 使用方法

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from '@lib/hooks/useTranslation'

const MyComponent = () => {
    const { t } = useTranslation()
    
    return (
        <Text>{t('common.save')}</Text>
    )
}
```

### 2. 切换语言

```tsx
import { useTranslation } from '@lib/hooks/useTranslation'

const LanguageSwitcher = () => {
    const { changeLanguage, currentLanguage } = useTranslation()
    
    const switchToChinese = () => {
        changeLanguage('zh')
    }
    
    const switchToEnglish = () => {
        changeLanguage('en')
    }
    
    return (
        <View>
            <Text>当前语言: {currentLanguage}</Text>
            <Button onPress={switchToChinese} title="切换到中文" />
            <Button onPress={switchToEnglish} title="Switch to English" />
        </View>
    )
}
```

## 翻译文件结构

翻译文件位于 `app/locales/{语言代码}/translation.json`

### 英文翻译文件 (`app/locales/en/translation.json`)
```json
{
    "common": {
        "save": "Save",
        "cancel": "Cancel"
    },
    "characters": {
        "noCharactersFound": "No Characters Found. Try Importing Some!"
    }
}
```

### 中文翻译文件 (`app/locales/zh/translation.json`)
```json
{
    "common": {
        "save": "保存",
        "cancel": "取消"
    },
    "characters": {
        "noCharactersFound": "未找到角色。尝试导入一些！"
    }
}
```

## 添加新的翻译

1. 在英文翻译文件中添加新的键值对
2. 在中文翻译文件中添加对应的翻译
3. 在组件中使用 `t('key.subkey')` 来引用翻译

## 语言切换

用户可以通过设置抽屉中的语言切换按钮来切换语言。语言设置会自动保存并在下次启动时恢复。

## 支持的翻译键

### 通用 (common)
- `tryAgain` - 重试
- `loading` - 加载中
- `save` - 保存
- `cancel` - 取消
- `delete` - 删除
- `edit` - 编辑
- `add` - 添加
- `search` - 搜索
- `settings` - 设置
- `about` - 关于
- `close` - 关闭
- `ok` - 确定
- `yes` - 是
- `no` - 否

### 身份验证 (auth)
- `authenticationRequired` - 需要身份验证
- `tryAgain` - 重试

### 数据库 (database)
- `migrationFailed` - 数据库迁移失败

### 角色 (characters)
- `noCharactersFound` - 未找到角色
- `noCharactersSearch` - 没有角色匹配搜索
- `importCharacters` - 导入角色
- `createCharacter` - 创建角色
- `characterName` - 角色名称
- `characterDescription` - 角色描述
- `characterTags` - 角色标签
- `characterAvatar` - 角色头像
- `characterPersonality` - 角色性格
- `characterInstructions` - 角色指令
- `characterExampleConversation` - 示例对话

### 对话 (chat)
- `newChat` - 新对话
- `sendMessage` - 发送消息
- `typeMessage` - 输入消息
- `chatHistory` - 对话历史
- `clearChat` - 清空对话
- `exportChat` - 导出对话
- `importChat` - 导入对话

### 设置 (settings)
- `appSettings` - 应用设置
- `chatSettings` - 对话设置
- `characterSettings` - 角色设置
- `modelSettings` - 模型设置
- `ttsSettings` - 语音合成设置
- `notificationSettings` - 通知设置
- `securitySettings` - 安全设置
- `styleSettings` - 样式设置
- `screenSettings` - 屏幕设置
- `databaseSettings` - 数据库设置
- `generatingSettings` - 生成设置

### 菜单 (menu)
- `sampler` - 采样器
- `formatting` - 格式化
- `api` - API
- `models` - 模型
- `tts` - 语音合成
- `logs` - 日志
- `about` - 关于
- `settings` - 设置

### 开发 (dev)
- `devBuild` - 开发版本
- `devMode` - 开发模式
- `components` - [开发] 组件
- `colorTest` - [开发] 颜色测试
- `markdown` - [开发] Markdown

### 错误 (errors)
- `generalError` - 发生错误
- `networkError` - 网络错误
- `fileError` - 文件错误
- `permissionError` - 权限被拒绝 