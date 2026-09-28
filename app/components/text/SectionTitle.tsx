import React, { ReactNode } from 'react'
import { TextProps, TextStyle } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

import TText from './TText'

const SectionTitle = ({
    children,
    style = undefined,
    visible = true,
    ...props
}: {
    props?: TextProps
    children?: ReactNode
    style?: TextStyle
    visible?: boolean
}) => {
    const { astryx } = Theme.useTheme()
    if (visible)
        return (
            <TText
                {...props}
                style={[
                    {
                        color: astryx.text.primary,
                        fontSize: 16,
                        fontWeight: '600',
                        lineHeight: 22,
                        paddingBottom: astryx.spacing.md,
                        borderBottomWidth: 1,
                        borderColor: astryx.border.default,
                    },
                    style,
                ]}>
                {children}
            </TText>
        )
}

export default SectionTitle
