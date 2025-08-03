import { Theme } from '@lib/theme/ThemeManager'
import { useTranslation } from '@lib/hooks/useTranslation'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const I18nTest = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    const { t, changeLanguage, currentLanguage } = useTranslation()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: spacing.xl,
            backgroundColor: color.neutral._100,
        },
        title: {
            fontSize: fontSize.xl2,
            color: color.text._100,
            marginBottom: spacing.xl,
            textAlign: 'center',
        },
        section: {
            marginBottom: spacing.xl,
        },
        sectionTitle: {
            fontSize: fontSize.xl,
            color: color.text._200,
            marginBottom: spacing.m,
        },
        text: {
            fontSize: fontSize.l,
            color: color.text._300,
            marginBottom: spacing.s,
        },
        button: {
            backgroundColor: color.primary._500,
            padding: spacing.m,
            borderRadius: spacing.m,
            marginBottom: spacing.s,
        },
        buttonText: {
            color: color.text._100,
            fontSize: fontSize.l,
            textAlign: 'center',
        },
        languageButton: {
            backgroundColor: color.secondary._500,
            padding: spacing.m,
            borderRadius: spacing.m,
            marginBottom: spacing.s,
        },
    })

    const switchLanguage = () => {
        const newLanguage = currentLanguage === 'en' ? 'zh' : 'en'
        changeLanguage(newLanguage)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>国际化测试 (i18n Test)</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>当前语言 / Current Language</Text>
                <Text style={styles.text}>
                    {currentLanguage === 'en' ? 'English' : '中文'} ({currentLanguage.toUpperCase()})
                </Text>
                <TouchableOpacity style={styles.languageButton} onPress={switchLanguage}>
                    <Text style={styles.buttonText}>
                        {currentLanguage === 'en' ? '切换到中文' : 'Switch to English'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>通用文本 / Common Text</Text>
                <Text style={styles.text}>保存: {t('common.save')}</Text>
                <Text style={styles.text}>取消: {t('common.cancel')}</Text>
                <Text style={styles.text}>删除: {t('common.delete')}</Text>
                <Text style={styles.text}>编辑: {t('common.edit')}</Text>
                <Text style={styles.text}>添加: {t('common.add')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>角色相关 / Character Related</Text>
                <Text style={styles.text}>未找到角色: {t('characters.noCharactersFound')}</Text>
                <Text style={styles.text}>角色名称: {t('characters.characterName')}</Text>
                <Text style={styles.text}>角色描述: {t('characters.characterDescription')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>菜单项 / Menu Items</Text>
                <Text style={styles.text}>设置: {t('menu.settings')}</Text>
                <Text style={styles.text}>关于: {t('menu.about')}</Text>
                <Text style={styles.text}>日志: {t('menu.logs')}</Text>
                <Text style={styles.text}>语音合成: {t('menu.tts')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>错误信息 / Error Messages</Text>
                <Text style={styles.text}>一般错误: {t('errors.generalError')}</Text>
                <Text style={styles.text}>网络错误: {t('errors.networkError')}</Text>
                <Text style={styles.text}>文件错误: {t('errors.fileError')}</Text>
            </View>
        </View>
    )
}

export default I18nTest 