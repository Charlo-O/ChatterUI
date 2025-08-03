import ThemedButton from '@components/buttons/ThemedButton'
import DropdownSheet from '@components/input/DropdownSheet'
import MultiDropdownSheet from '@components/input/MultiDropdownSheet'
import StringArrayEditor from '@components/input/StringArrayEditor'
import ThemedCheckbox from '@components/input/ThemedCheckbox'
import ThemedSlider from '@components/input/ThemedSlider'
import ThemedSwitch from '@components/input/ThemedSwitch'
import ThemedTextInput from '@components/input/ThemedTextInput'
import Accordion from '@components/views/Accordion'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Theme } from '@lib/theme/ThemeManager'
import { useTranslation } from '@lib/hooks/useTranslation'

const selectorData = [
    { label: 'Item 0', value: '1' },
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
]

const buttonVariants = ['primary', 'secondary', 'tertiary', 'critical', 'disabled']

const ComponentTest = () => {
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

    const [selected, setSelected] = useState<(typeof selectorData)[0]>(selectorData[0])
    const [selectedM, setSelectedM] = useState<typeof selectorData>([])
    const [slider, setSlider] = useState(0)
    const [data, setData] = useState<string[]>([])
    const [textInputData, setTextInputData] = useState('')
    const [checkbox, setCheckbox] = useState(true)
    const [sw, setSw] = useState(true)

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ rowGap: 16, padding: 16 }}
            keyboardShouldPersistTaps="always">
            <View style={{ rowGap: 8 }}>
                {buttonVariants.map((item) => (
                    //@ts-ignore
                    <ThemedButton variant={item} key={item} label={`Button Variant: ${item}`} />
                ))}
            </View>
            <Accordion label="Test Accordion">
                <Text style={{ color: 'yellow' }}>TEST TEXT</Text>
            </Accordion>
            <StringArrayEditor label="Test Input Label" value={data} setValue={setData} />
            <ThemedCheckbox label="Test Checkbox" value={checkbox} onChangeValue={setCheckbox} />
            <ThemedSwitch label="Test Switch" value={sw} onChangeValue={setSw} />
            <ThemedSlider
                value={slider}
                onValueChange={setSlider}
                min={0}
                max={10}
                step={1}
                label="Test Slider"
            />
            <ThemedTextInput
                label="Test Text"
                value={textInputData}
                onChangeText={setTextInputData}
            />
            <DropdownSheet
                data={selectorData}
                selected={selected}
                onChangeValue={setSelected}
                labelExtractor={(item) => item.label}
            />
            <MultiDropdownSheet
                data={selectorData}
                selected={selectedM}
                onChangeValue={setSelectedM}
                labelExtractor={(item) => item.label}
            />
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>国际化测试 (i18n Test)</Text>
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
        </ScrollView>
    )
}

export default ComponentTest
