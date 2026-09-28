import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import React, { ReactNode } from 'react'
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

/** Astryx action variants plus aliases retained for existing callers. */
export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'tertiary'
    | 'critical'
    | 'disabled'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ThemedButtonProps extends Omit<PressableProps, 'style' | 'disabled'> {
    labelStyle?: TextStyle
    label?: string
    /** Existing prop retained for source compatibility. */
    buttonStyle?: StyleProp<ViewStyle>
    /** `style` is the Astryx/native spelling; both styles are merged. */
    style?: StyleProp<ViewStyle>
    opacity?: number
    variant?: ButtonVariant
    size?: ButtonSize
    iconName?: keyof typeof AntDesign.glyphMap
    iconSize?: number
    iconStyle?: TextStyle
    icon?: ReactNode
    loading?: boolean
    disabled?: boolean
    /** Allows a caller to keep the pressed treatment for a controlled preview. */
    pressed?: boolean
}

type ResolvedVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

const resolveVariant = (
    variant: ButtonVariant
): {
    variant: ResolvedVariant
    forceDisabled: boolean
} => {
    switch (variant) {
        case 'tertiary':
            return { variant: 'ghost', forceDisabled: false }
        case 'critical':
            return { variant: 'destructive', forceDisabled: false }
        case 'disabled':
            return { variant: 'secondary', forceDisabled: true }
        default:
            return { variant: variant, forceDisabled: false }
    }
}

const getPalette = (
    tokens: ReturnType<typeof Theme.useTheme>['astryx'],
    variant: ResolvedVariant,
    disabled: boolean
) => {
    // The neutral Astryx gallery uses a dark accent in light mode and a light
    // accent in dark mode. A neutral surface stays readable for legacy themes.
    const dark = tokens.dark
    const destructiveBackground = dark ? 'rgba(255, 152, 144, 0.24)' : '#FFC4BE'
    const destructiveText = dark ? '#FFC4BE' : '#76000C'
    const secondaryBackground = dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
    const secondaryText = tokens.text.primary

    if (disabled) {
        return {
            backgroundColor: tokens.background.muted,
            borderColor: 'transparent',
            color: tokens.text.disabled,
        }
    }

    switch (variant) {
        case 'primary':
            return {
                backgroundColor: tokens.accent.primary,
                borderColor: 'transparent',
                color: tokens.accent.onPrimary,
            }
        case 'secondary':
            return {
                backgroundColor: secondaryBackground,
                borderColor: 'transparent',
                color: secondaryText,
            }
        case 'ghost':
            return {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                color: secondaryText,
            }
        case 'destructive':
            return {
                backgroundColor: destructiveBackground,
                borderColor: 'transparent',
                color: destructiveText,
            }
    }
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
    labelStyle,
    label,
    buttonStyle,
    style,
    children,
    onPress,
    onPressIn,
    onPressOut,
    opacity = 1,
    variant = 'primary',
    size = 'md',
    iconName,
    iconSize = 16,
    iconStyle,
    icon,
    loading = false,
    disabled = false,
    pressed: controlledPressed,
    accessibilityLabel,
    accessibilityState,
    ...rest
}) => {
    const theme = Theme.useTheme()
    const tokens = theme.astryx
    const resolved = resolveVariant(variant)
    const isDisabled = disabled || loading || resolved.forceDisabled
    const palette = getPalette(tokens, resolved.variant, isDisabled)
    // Pressable also permits a render-function child. ThemedButton owns its
    // content layout, so leave that advanced child form untouched rather than
    // trying to pass a function through Text.
    const content = label ?? (typeof children === 'function' ? undefined : children)
    const resolvedAccessibilityLabel =
        accessibilityLabel ??
        (typeof label === 'string' ? label : typeof children === 'string' ? children : undefined)

    return (
        <Pressable
            {...rest}
            disabled={isDisabled}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            accessibilityRole={rest.accessibilityRole ?? 'button'}
            accessibilityLabel={resolvedAccessibilityLabel}
            accessibilityState={{
                ...(accessibilityState ?? {}),
                disabled: isDisabled,
                busy: loading,
            }}
            style={({ pressed: nativePressed }) => {
                const isPressed = controlledPressed ?? nativePressed
                const minHeight = tokens.size[size]
                return [
                    styles.button,
                    {
                        minHeight: minHeight,
                        paddingHorizontal: size === 'lg' ? tokens.spacing.lg : tokens.spacing.md,
                        backgroundColor: palette.backgroundColor,
                        borderColor: palette.borderColor,
                        borderRadius: tokens.radius.full,
                        opacity: isDisabled ? 0.48 : isPressed ? 0.72 * opacity : opacity,
                    },
                    buttonStyle,
                    style,
                ]
            }}>
            {loading ? (
                <ActivityIndicator size="small" color={palette.color} />
            ) : (
                (icon ??
                (iconName ? (
                    iconName === 'search' ? (
                        <MaterialIcons
                            name="search"
                            size={iconSize}
                            style={iconStyle}
                            color={palette.color}
                        />
                    ) : (
                        <AntDesign
                            name={iconName}
                            size={iconSize}
                            style={iconStyle}
                            color={palette.color}
                        />
                    )
                ) : null))
            )}
            {content !== undefined && content !== null && (
                <TText style={[styles.label, { color: palette.color }, labelStyle]}>
                    {content as React.ReactNode}
                </TText>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderWidth: 0,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        textAlign: 'center',
    },
})

export default ThemedButton
