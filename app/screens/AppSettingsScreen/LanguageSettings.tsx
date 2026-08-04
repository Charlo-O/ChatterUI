import { View } from 'react-native'

import HorizontalSelector from '@components/input/HorizontalSelector'
import SectionTitle from '@components/text/SectionTitle'
import { useI18n, LanguagePreference } from '@lib/i18n'

const languageOptions: { label: string; value: LanguagePreference }[] = [
    { label: 'System', value: 'system' },
    { label: 'English', value: 'en-US' },
    { label: 'Simplified Chinese', value: 'zh-CN' },
]

const LanguageSettings = () => {
    const { preference, setLanguagePreference, t } = useI18n()

    return (
        <View style={{ rowGap: 8 }}>
            <SectionTitle>Language</SectionTitle>
            <HorizontalSelector
                values={languageOptions}
                selected={preference}
                onPress={setLanguagePreference}
                description={t('Language follows the device setting.')}
            />
        </View>
    )
}

export default LanguageSettings
