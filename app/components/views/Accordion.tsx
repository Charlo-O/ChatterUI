import { Entypo } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Pressable, Text, TextStyle, View, ViewProps, ViewStyle } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

interface AccordionProps extends ViewProps {
    defaultState?: boolean
    label?: string
    labelStyle?: TextStyle
    accordionStyle?: ViewStyle
}

const Accordion: React.FC<AccordionProps> = ({
    defaultState = false,
    label = '',
    labelStyle = {},
    accordionStyle = {},
    children,
    ...rest
}) => {
    const { color, spacing, borderRadius } = Theme.useTheme()

    const [show, setShow] = useState(defaultState)
    return (
        <View {...rest}>
            <Pressable
                onPress={() => setShow(!show)}
                style={{
                    backgroundColor: color.neutral._200,
                    borderColor: color.neutral._400,
                    borderWidth: 1,
                    paddingVertical: spacing.l,
                    borderTopLeftRadius: borderRadius.l,
                    borderTopRightRadius: borderRadius.l,
                    borderBottomLeftRadius: show ? 0 : borderRadius.l,
                    borderBottomRightRadius: show ? 0 : borderRadius.l,
                    paddingHorizontal: spacing.xl,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...accordionStyle,
                }}>
                <Text style={{ color: color.text._100, fontWeight: '600', ...labelStyle }}>
                    {label}
                </Text>
                <Entypo
                    name={show ? 'chevron-up' : 'chevron-down'}
                    color={color.text._400}
                    size={18}
                />
            </Pressable>

            {show && (
                <View
                    style={{
                        backgroundColor: color.neutral._200,
                        borderColor: color.neutral._400,
                        borderWidth: 1,
                        borderTopWidth: 0,
                        paddingHorizontal: spacing.xl,
                        paddingTop: spacing.xl,
                        paddingBottom: spacing.l,
                        borderBottomLeftRadius: borderRadius.l,
                        borderBottomRightRadius: borderRadius.l,
                    }}>
                    {children}
                </View>
            )}
        </View>
    )
}

export default Accordion
