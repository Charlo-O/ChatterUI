import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { Global } from '@lib/constants/GlobalValues'
import { getMMKVString, setMMKVString } from '@lib/storage/MMKV'

import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

export type AppLocale = 'en-US' | 'zh-CN'
export type LanguagePreference = 'system' | AppLocale

const LANGUAGE_PREFERENCE_KEY = Global.Language
const resources = {
    'en-US': { translation: enUS },
    'zh-CN': { translation: zhCN },
} as const

const getSystemLocale = (): AppLocale => {
    const languageTag = getLocales()[0]?.languageTag?.toLowerCase() ?? ''
    return languageTag.startsWith('zh') ? 'zh-CN' : 'en-US'
}

const isLanguagePreference = (value: string | undefined): value is LanguagePreference =>
    value === 'system' || value === 'en-US' || value === 'zh-CN'

const getStoredPreference = (): LanguagePreference => {
    const stored = getMMKVString(LANGUAGE_PREFERENCE_KEY) ?? undefined
    return isLanguagePreference(stored) ? stored : 'system'
}

const resolveLocale = (preference: LanguagePreference): AppLocale =>
    preference === 'system' ? getSystemLocale() : preference

if (!i18n.isInitialized) {
    void i18n.init({
        resources,
        lng: resolveLocale(getStoredPreference()),
        fallbackLng: 'en-US',
        interpolation: { escapeValue: false },
        returnNull: false,
    })
}

type I18nContextValue = {
    locale: AppLocale
    preference: LanguagePreference
    setLanguagePreference: (preference: LanguagePreference) => void
    t: (key: string, options?: Record<string, unknown>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [preference, setPreference] = useState<LanguagePreference>(getStoredPreference)
    const [locale, setLocale] = useState<AppLocale>(resolveLocale(preference))

    useEffect(() => {
        const handleLanguageChanged = (nextLocale: string) => {
            setLocale(nextLocale === 'zh-CN' ? 'zh-CN' : 'en-US')
        }
        const handleInitialized = () => {
            setLocale(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US')
        }
        i18n.on('languageChanged', handleLanguageChanged)
        i18n.on('initialized', handleInitialized)
        return () => {
            i18n.off('languageChanged', handleLanguageChanged)
            i18n.off('initialized', handleInitialized)
        }
    }, [])

    const setLanguagePreference = useCallback((nextPreference: LanguagePreference) => {
        setMMKVString(LANGUAGE_PREFERENCE_KEY, nextPreference)
        setPreference(nextPreference)
        void i18n.changeLanguage(resolveLocale(nextPreference))
    }, [])

    const value = useMemo<I18nContextValue>(
        () => ({
            locale,
            preference,
            setLanguagePreference,
            t: (key, options) => String(i18n.t(key, options as never)),
        }),
        [locale, preference, setLanguagePreference]
    )

    return React.createElement(I18nContext.Provider, { value }, children)
}

export const useI18n = (): I18nContextValue => {
    const context = useContext(I18nContext)
    if (context) return context
    return {
        locale: 'en-US',
        preference: 'system',
        setLanguagePreference: () => {},
        t: (key, options) => String(i18n.t(key, options as never)),
    }
}

export const getLanguagePreferenceLabel = (preference: LanguagePreference): string => {
    if (preference === 'system') return i18n.t('System')
    if (preference === 'zh-CN') return i18n.t('Simplified Chinese')
    return i18n.t('English')
}

export { i18n }
