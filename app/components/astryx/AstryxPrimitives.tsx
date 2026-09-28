import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import React, { ReactNode } from 'react'
import {
    ActivityIndicator,
    AccessibilityRole,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

/** Compatibility API: existing screens share the Liquid Glass visual tokens. */
export const useAstryxTokens = () => Theme.useTheme().astryx

export type AstryxButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

type ButtonProps = Omit<PressableProps, 'style'> & {
    label?: string
    variant?: AstryxButtonVariant
    size?: 'sm' | 'md' | 'lg'
    icon?: ReactNode
    iconName?: keyof typeof AntDesign.glyphMap
    iconSize?: number
    loading?: boolean
    labelStyle?: TextStyle
    style?: StyleProp<ViewStyle>
}

export const AstryxButton: React.FC<ButtonProps> = ({
    label,
    variant = 'secondary',
    size = 'md',
    icon,
    iconName,
    iconSize = 16,
    loading = false,
    disabled = false,
    labelStyle,
    style,
    accessibilityLabel,
    children,
    ...rest
}) => {
    const tokens = useAstryxTokens()
    const isDisabled = disabled || loading
    const content = label ?? (typeof children === 'function' ? undefined : children)
    const height = tokens.size[size]
    const isDark = tokens.dark
    const secondaryBackground = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
    const secondaryText = tokens.text.primary
    // Keep the neutral gallery's variant pairs, including the translucent
    // dark-mode surfaces. `status.error` is a semantic status foreground and
    // is intentionally not used as the button fill.
    const errorFill = isDark ? 'rgba(255, 152, 144, 0.24)' : '#FFC4BE'
    const errorOnFill = isDark ? '#FFC4BE' : '#76000C'
    const palette = {
        primary: {
            backgroundColor: tokens.accent.primary,
            borderColor: 'transparent',
            color: tokens.accent.onPrimary,
        },
        secondary: {
            backgroundColor: secondaryBackground,
            borderColor: 'transparent',
            color: secondaryText,
        },
        ghost: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            color: secondaryText,
        },
        destructive: {
            backgroundColor: errorFill,
            borderColor: errorFill,
            color: errorOnFill,
        },
    }[variant]

    return (
        <Pressable
            {...rest}
            accessibilityRole={(rest.accessibilityRole ?? 'button') as AccessibilityRole}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityState={{
                ...(rest.accessibilityState ?? {}),
                disabled: isDisabled,
                busy: loading,
            }}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                {
                    minHeight: height,
                    paddingHorizontal: size === 'lg' ? 16 : 12,
                    backgroundColor: palette.backgroundColor,
                    borderColor: palette.borderColor,
                    opacity: isDisabled ? 0.48 : pressed ? 0.72 : 1,
                    borderRadius: tokens.radius.full,
                },
                style,
            ]}>
            {loading ? (
                <ActivityIndicator size="small" color={palette.color} />
            ) : (
                (icon ??
                (iconName ? (
                    <AntDesign name={iconName} size={iconSize} color={palette.color} />
                ) : null))
            )}
            {content !== undefined && content !== null && (
                <Text style={[styles.buttonLabel, { color: palette.color }, labelStyle]}>
                    {content as React.ReactNode}
                </Text>
            )}
        </Pressable>
    )
}

export const AstryxIconButton: React.FC<
    Omit<ButtonProps, 'label' | 'children' | 'iconName'> & {
        iconName: keyof typeof AntDesign.glyphMap
        label: string
    }
> = ({ iconName, label, size = 'md', ...props }) => (
    <AstryxButton
        {...props}
        label={undefined}
        iconName={iconName}
        size={size}
        accessibilityLabel={label}
        style={[styles.iconButton, props.style]}
    />
)

export const AstryxCard: React.FC<{
    children: ReactNode
    style?: StyleProp<ViewStyle>
    muted?: boolean
    elevation?: 'none' | 'low' | 'med' | 'high'
    onPress?: () => void
    accessibilityLabel?: string
}> = ({ children, style, muted = false, elevation = 'none', onPress, accessibilityLabel }) => {
    const tokens = useAstryxTokens()
    const shadowColor =
        elevation === 'high'
            ? tokens.shadow.high
            : elevation === 'med'
              ? tokens.shadow.med
              : elevation === 'low'
                ? tokens.shadow.low
                : 'transparent'
    const content = (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: muted ? tokens.background.muted : tokens.background.card,
                    borderColor: tokens.border.default,
                    borderRadius: tokens.radius.container,
                    shadowColor: shadowColor,
                },
                style,
            ]}>
            {children}
        </View>
    )
    if (!onPress) return content
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            onPress={onPress}
            style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}>
            {content}
        </Pressable>
    )
}

export const AstryxBadge: React.FC<{
    children: ReactNode
    variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'blue' | 'purple' | 'teal'
    style?: StyleProp<ViewStyle>
}> = ({ children, variant = 'neutral', style }) => {
    const tokens = useAstryxTokens()
    const isDark = tokens.dark
    const colors = {
        neutral: [tokens.background.muted, tokens.text.secondary],
        info: [tokens.accent.muted, tokens.accent.primary],
        success: [
            isDark ? 'rgba(57, 221, 137, 0.18)' : '#D6FEE4',
            isDark ? '#6BE7A5' : tokens.status.success,
        ],
        warning: [
            isDark ? 'rgba(255, 210, 92, 0.18)' : '#FFF0C2',
            isDark ? '#FFD25C' : tokens.status.warning,
        ],
        error: [
            isDark ? 'rgba(255, 152, 144, 0.24)' : '#FEE4E6',
            isDark ? '#FFC4BE' : tokens.status.error,
        ],
        blue: [isDark ? 'rgba(61, 135, 255, 0.22)' : '#DBECFF', isDark ? '#8EBBFF' : '#042F97'],
        purple: [isDark ? 'rgba(166, 137, 255, 0.22)' : '#E8E8FB', isDark ? '#C5B4FF' : '#3E0697'],
        teal: [isDark ? 'rgba(61, 220, 205, 0.2)' : '#D7FCF8', isDark ? '#73E4D8' : '#08767D'],
    }[variant]
    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: colors[0], borderRadius: tokens.radius.full },
                style,
            ]}>
            <Text style={[styles.badgeText, { color: colors[1] }]}>{children}</Text>
        </View>
    )
}

export const AstryxDivider = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    const tokens = useAstryxTokens()
    return <View style={[styles.divider, { backgroundColor: tokens.border.default }, style]} />
}

export const AstryxSegmentedControl = <T,>({
    values,
    selected,
    onChange,
    accessibilityLabel,
}: {
    values: { label: string; value: T }[]
    selected: T
    onChange: (value: T) => void
    accessibilityLabel?: string
}) => {
    const tokens = useAstryxTokens()
    return (
        <View
            accessibilityRole="tablist"
            accessibilityLabel={accessibilityLabel}
            style={[
                styles.segmented,
                { backgroundColor: tokens.background.muted, borderRadius: tokens.radius.element },
            ]}>
            {values.map((item) => {
                const active = Object.is(item.value, selected)
                return (
                    <Pressable
                        key={item.label}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        onPress={() => onChange(item.value)}
                        style={({ pressed }) => [
                            styles.segment,
                            {
                                backgroundColor: active ? tokens.background.surface : 'transparent',
                                borderColor: active ? tokens.border.default : 'transparent',
                                opacity: pressed ? 0.72 : 1,
                                borderRadius: tokens.radius.inner,
                            },
                        ]}>
                        <Text
                            style={{
                                color: active ? tokens.text.primary : tokens.text.secondary,
                                fontWeight: active ? '600' : '500',
                            }}>
                            {item.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

export const AstryxEmptyState: React.FC<{
    icon?: keyof typeof MaterialIcons.glyphMap
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
}> = ({ icon = 'inbox', title, description, actionLabel, onAction }) => {
    const tokens = useAstryxTokens()
    return (
        <View style={styles.emptyState}>
            {icon && <MaterialIcons name={icon} size={42} color={tokens.text.muted} />}
            <Text style={[styles.emptyTitle, { color: tokens.text.primary }]}>{title}</Text>
            {description && (
                <Text style={[styles.emptyDescription, { color: tokens.text.secondary }]}>
                    {description}
                </Text>
            )}
            {actionLabel && onAction && (
                <AstryxButton label={actionLabel} variant="primary" onPress={onAction} />
            )}
        </View>
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
    buttonLabel: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
    },
    iconButton: {
        minWidth: 44,
        minHeight: 44,
        paddingHorizontal: 0,
        width: 44,
        borderRadius: 999,
    },
    card: {
        borderWidth: 0,
        padding: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    segmented: {
        alignItems: 'stretch',
        flexDirection: 'row',
        gap: 2,
        padding: 2,
    },
    segment: {
        alignItems: 'center',
        borderWidth: 1,
        flex: 1,
        justifyContent: 'center',
        minHeight: 40,
        paddingHorizontal: 12,
    },
    emptyState: {
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 14,
        lineHeight: 20,
        maxWidth: 360,
        textAlign: 'center',
    },
})

export default AstryxButton
