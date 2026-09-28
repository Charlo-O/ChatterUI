import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'

import Avatar from '@components/views/Avatar'
import { Theme } from '@lib/theme/ThemeManager'

/** Circular portrait with the reference's fine rim and restrained lens highlight. */
export default function GlassPortrait({
    image,
    size = 60,
    style,
}: {
    image: string
    size?: number
    style?: StyleProp<ViewStyle>
}) {
    const { glass } = Theme.useTheme()
    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: glass.inset,
                    boxShadow: '0 2px 5px ' + glass.shadow + '24',
                },
                style,
            ]}>
            <Avatar
                targetImage={image}
                style={{ width: size, height: size, borderRadius: size / 2 }}
            />
            <LinearGradient
                pointerEvents="none"
                colors={['#FFFFFF38', '#FFFFFF00', '#10101212']}
                locations={[0, 0.35, 1]}
                style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
            />
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: size / 2, borderWidth: 1.5, borderColor: glass.glassBorder },
                ]}
            />
        </View>
    )
}
