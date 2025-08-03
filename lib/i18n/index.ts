import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 导入翻译文件
import enTranslation from '../../app/locales/en/translation.json'
import zhTranslation from '../../app/locales/zh/translation.json'

const resources = {
    en: {
        translation: enTranslation,
    },
    zh: {
        translation: zhTranslation,
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: Localization.locale.split('-')[0], // 获取设备语言代码
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React已经处理了XSS
    },
    compatibilityJSON: 'v3', // 兼容React Native
})

export default i18n 