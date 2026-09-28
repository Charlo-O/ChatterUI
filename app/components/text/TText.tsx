import React, { useMemo } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { useI18n } from '@lib/i18n'
import { Theme } from '@lib/theme/ThemeManager'

type LegacyFontColor = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
type SemanticFontColor = 'primary' | 'secondary' | 'muted' | 'disabled' | 'accent'
type FontColor = LegacyFontColor | SemanticFontColor

interface TTextProps extends TextProps {
    color?: FontColor
}
const styles = StyleSheet.create({
    text: {
        fontWeight: 'normal',
    },
})

const TText: React.FC<TTextProps> = ({ color: colorTone = '100', children, style, ...props }) => {
    const { color: themeColor, astryx } = Theme.useTheme()
    const { t } = useI18n()
    const colorOverride = useMemo(
        () => ({
            color:
                colorTone === 'accent'
                    ? astryx.accent.primary
                    : colorTone === 'primary' ||
                        colorTone === 'secondary' ||
                        colorTone === 'muted' ||
                        colorTone === 'disabled'
                      ? astryx.text[colorTone]
                      : themeColor.text[`_${colorTone}`],
        }),
        [colorTone, themeColor, astryx]
    )
    return (
        <Text style={[colorOverride, styles.text, style]} {...props}>
            {typeof children === 'string' ? t(children) : children}
        </Text>
    )
}

export default TText
