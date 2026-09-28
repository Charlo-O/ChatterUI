import React from 'react'
import { AccessibilityState, StyleProp, StyleSheet, Switch, View, ViewStyle } from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

interface ThemedSwitchProps {
    description?: string
    label?: string
    value: boolean | undefined
    onChangeValue: (b: boolean) => void
    accessibilityLabel?: string
    accessibilityHint?: string
    accessibilityState?: AccessibilityState
    disabled?: boolean
    style?: StyleProp<ViewStyle>
}

const ThemedSwitch: React.FC<ThemedSwitchProps> = ({
    description,
    label,
    value,
    onChangeValue,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    disabled = false,
    style,
}) => {
    const { astryx: tokens } = Theme.useTheme()
    const isEnabled = Boolean(value)

    return (
        <View style={[styles.container, !label && !description && styles.compact, style]}>
            <View style={[styles.row, { paddingVertical: tokens.spacing.md }]}>
                <Switch
                    trackColor={{
                        false: tokens.border.emphasized,
                        true: tokens.accent.primary,
                    }}
                    thumbColor={isEnabled ? tokens.accent.onPrimary : tokens.background.surface}
                    ios_backgroundColor={tokens.border.emphasized}
                    onValueChange={onChangeValue}
                    value={isEnabled}
                    disabled={disabled}
                    accessibilityLabel={accessibilityLabel ?? label ?? 'Toggle'}
                    accessibilityHint={accessibilityHint ?? description}
                    accessibilityState={{
                        ...(accessibilityState ?? {}),
                        checked: isEnabled,
                        disabled,
                    }}
                />
                {label && (
                    <TText
                        style={[
                            styles.label,
                            {
                                marginLeft: tokens.spacing.xl,
                                color: disabled
                                    ? tokens.text.disabled
                                    : isEnabled
                                      ? tokens.text.primary
                                      : tokens.text.secondary,
                            },
                        ]}>
                        {label}
                    </TText>
                )}
            </View>
            {description && (
                <TText
                    style={[
                        styles.description,
                        {
                            color: disabled ? tokens.text.disabled : tokens.text.secondary,
                            paddingBottom: tokens.spacing.xs,
                            marginBottom: tokens.spacing.md,
                        },
                    ]}>
                    {description}
                </TText>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    compact: {
        width: 'auto',
        flexShrink: 0,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    label: {
        flex: 1,
        fontWeight: '500',
    },
    description: {
        lineHeight: 18,
    },
})

export default ThemedSwitch
