import React, { useMemo } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'
import { useI18n } from '@lib/i18n'

type FontColor = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

interface TTextProps extends TextProps {
    color?: FontColor
}
const styles = StyleSheet.create({
    text: {
        fontWeight: 'normal',
    },
})

const TText: React.FC<TTextProps> = ({ color = '100', children, style, ...props }) => {
    const { color: themeColor } = Theme.useTheme()
    const { t } = useI18n()
    const colorOverride = useMemo(
        () => ({
            color: themeColor.text[`_${color}`],
        }),
        [color, themeColor]
    )
    return (
        <Text style={[colorOverride, styles.text, style]} {...props}>
            {typeof children === 'string' ? t(children) : children}
        </Text>
    )
}

export default TText
