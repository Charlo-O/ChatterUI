import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from '@lib/hooks/useTranslation'
import { Theme } from '@lib/theme/ThemeManager'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const LanguageToggle = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    const { t, changeLanguage, currentLanguage } = useTranslation()

    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'en' ? 'zh' : 'en'
        changeLanguage(newLanguage)
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: spacing.xl,
            paddingVertical: spacing.m,
        },
        text: {
            fontSize: fontSize.xl,
            color: color.text._100,
            marginLeft: spacing.l,
        },
        languageIndicator: {
            fontSize: fontSize.m,
            color: color.text._400,
            marginLeft: spacing.s,
        },
    })

    return (
        <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
            <AntDesign name="earth" size={24} color={color.text._400} />
            <Text style={styles.text}>
                {currentLanguage === 'en' ? 'English' : '中文'}
            </Text>
            <Text style={styles.languageIndicator}>
                ({currentLanguage.toUpperCase()})
            </Text>
        </TouchableOpacity>
    )
}

export default LanguageToggle 