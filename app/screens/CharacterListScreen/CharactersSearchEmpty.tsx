import { Ionicons } from '@expo/vector-icons'
import { View } from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

const CharSearchEmpty = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    return (
        <View
            style={{
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.m,
                flex: 1,
                alignItems: 'center',
                marginTop: spacing.xl3,
            }}>
            <Ionicons name="search" color={color.text._400} size={60} />
            <TText
                style={{
                    color: color.text._400,
                    marginTop: spacing.xl,
                    fontStyle: 'italic',
                    fontSize: fontSize.l,
                }}>
                No Characters Match Search Result
            </TText>
        </View>
    )
}

export default CharSearchEmpty
