import { MaterialIcons } from '@expo/vector-icons'
import { View } from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

const CharactersEmpty = () => {
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
            <MaterialIcons name="person-search" color={color.text._600} size={48} />
            <TText
                style={{
                    color: color.text._500,
                    marginTop: spacing.xl,
                    fontSize: fontSize.m,
                    textAlign: 'center',
                }}>
                No Characters Found. Try Importing Some!
            </TText>
        </View>
    )
}

export default CharactersEmpty
