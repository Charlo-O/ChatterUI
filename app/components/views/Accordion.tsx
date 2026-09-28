import { Entypo } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

interface AccordionProps extends ViewProps {
    defaultState?: boolean
    label?: string
    labelStyle?: StyleProp<TextStyle>
    accordionStyle?: StyleProp<ViewStyle>
}

const Accordion: React.FC<AccordionProps> = ({
    defaultState = false,
    label = '',
    labelStyle = {},
    accordionStyle = {},
    children,
    ...rest
}) => {
    const { astryx: tokens } = Theme.useTheme()

    const [show, setShow] = useState(defaultState)
    return (
        <View {...rest}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ expanded: show }}
                onPress={() => setShow(!show)}
                style={({ pressed }) => [
                    styles.header,
                    {
                        backgroundColor: tokens.background.muted,
                        borderColor: show ? tokens.border.focus : tokens.border.default,
                        borderTopLeftRadius: tokens.radius.element,
                        borderTopRightRadius: tokens.radius.element,
                        borderBottomLeftRadius: show ? 0 : tokens.radius.element,
                        borderBottomRightRadius: show ? 0 : tokens.radius.element,
                        paddingVertical: tokens.spacing.md,
                        paddingHorizontal: tokens.spacing.lg,
                        opacity: pressed ? 0.76 : 1,
                    },
                    accordionStyle,
                ]}>
                <TText style={[styles.label, { color: tokens.text.primary }, labelStyle]}>
                    {label}
                </TText>
                <Entypo
                    name={show ? 'chevron-up' : 'chevron-down'}
                    color={tokens.text.secondary}
                    size={18}
                />
            </Pressable>

            {show && (
                <View
                    style={[
                        styles.content,
                        {
                            backgroundColor: tokens.background.surface,
                            borderColor: tokens.border.focus,
                            paddingHorizontal: tokens.spacing.lg,
                            paddingTop: tokens.spacing.lg,
                            paddingBottom: tokens.spacing.md,
                            borderBottomLeftRadius: tokens.radius.element,
                            borderBottomRightRadius: tokens.radius.element,
                        },
                    ]}>
                    {children}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        flex: 1,
        fontWeight: '600',
    },
    content: {
        borderTopWidth: 0,
        borderWidth: 1,
    },
})

export default Accordion
