import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from '@lib/hooks/useTranslation'
import { Theme } from '@lib/theme/ThemeManager'
import { View, Text } from 'react-native'

const CharactersEmpty = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    const { t } = useTranslation()
    return (
        <View
            style={{
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.m,
                flex: 1,
                alignItems: 'center',
                marginTop: spacing.xl3,
            }}>
            <Ionicons name="person-outline" color={color.text._400} size={60} />
            <Text
                style={{
                    color: color.text._400,
                    marginTop: spacing.xl,
                    fontStyle: 'italic',
                    fontSize: fontSize.l,
                }}>
                {t('characters.noCharactersFound')}
            </Text>
        </View>
    )
}

export default CharactersEmpty
