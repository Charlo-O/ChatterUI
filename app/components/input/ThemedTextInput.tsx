import React, { useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'

import TText from '@components/text/TText'
import { useUnfocusTextInput } from '@lib/hooks/UnfocusTextInput'
import { useI18n } from '@lib/i18n'
import { Theme } from '@lib/theme/ThemeManager'

export type TextInputStatus = 'default' | 'success' | 'warning' | 'error'

export interface ThemedTextInputProps extends TextInputProps {
    label?: string
    description?: string
    value?: string
    containerStyle?: StyleProp<ViewStyle>
    autoUnfocus?: boolean
    /** Astryx field status. `error` also implies `status="error"`. */
    status?: TextInputStatus
    error?: string | boolean
    statusMessage?: string
    required?: boolean
    labelStyle?: TextStyle
    descriptionStyle?: TextStyle
    errorStyle?: TextStyle
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
    label,
    description,
    numberOfLines,
    multiline = false,
    placeholder,
    value,
    style,
    autoUnfocus = true,
    containerStyle,
    status = 'default',
    error,
    statusMessage,
    required = false,
    labelStyle,
    descriptionStyle,
    errorStyle,
    onFocus,
    onBlur,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    editable = true,
    placeholderTextColor,
    defaultValue: _defaultValue,
    ...rest
}) => {
    const { astryx: tokens } = Theme.useTheme()
    const { t } = useI18n()
    const ref = useUnfocusTextInput()
    const [focused, setFocused] = useState(false)

    const hasError = status === 'error' || Boolean(error)
    const resolvedStatus: TextInputStatus = hasError ? 'error' : status
    const statusColor =
        resolvedStatus === 'success'
            ? tokens.status.success
            : resolvedStatus === 'warning'
              ? tokens.status.warning
              : resolvedStatus === 'error'
                ? tokens.status.error
                : undefined
    const supportingText =
        typeof error === 'string' ? error : (statusMessage ?? (hasError ? undefined : description))
    const translatedPlaceholder = placeholder ? t(placeholder) : undefined
    const resolvedAccessibilityLabel = accessibilityLabel ?? label ?? translatedPlaceholder
    const resolvedAccessibilityHint =
        accessibilityHint ??
        ([description, typeof error === 'string' ? error : undefined].filter(Boolean).join('. ') ||
            undefined)
    const isMultiline = (!!numberOfLines && numberOfLines > 1) || multiline
    const mergedAccessibilityState = {
        ...(accessibilityState ?? {}),
        disabled: editable === false,
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <TText style={[styles.label, { color: tokens.text.primary }, labelStyle]}>
                    {required ? `${label} *` : label}
                </TText>
            )}
            <TextInput
                ref={autoUnfocus ? ref : undefined}
                multiline={isMultiline}
                numberOfLines={numberOfLines}
                editable={editable}
                placeholder={translatedPlaceholder}
                placeholderTextColor={placeholderTextColor ?? tokens.text.secondary}
                accessibilityLabel={resolvedAccessibilityLabel}
                accessibilityHint={resolvedAccessibilityHint}
                accessibilityState={mergedAccessibilityState}
                onFocus={(event) => {
                    setFocused(true)
                    onFocus?.(event)
                }}
                onBlur={(event) => {
                    setFocused(false)
                    onBlur?.(event)
                }}
                {...(value === undefined ? { defaultValue: _defaultValue } : { value })}
                style={[
                    styles.input,
                    {
                        color: tokens.text.primary,
                        backgroundColor: tokens.background.surface,
                        borderRadius: isMultiline ? 20 : 24,
                        borderColor:
                            statusColor ?? (focused ? tokens.border.focus : tokens.border.default),
                        borderWidth: 1,
                        minHeight: isMultiline
                            ? Math.max(
                                  tokens.size.lg,
                                  (numberOfLines ?? 2) * 20 + tokens.spacing.md
                              )
                            : tokens.size.lg,
                        textAlignVertical: isMultiline ? 'top' : 'center',
                        opacity: editable === false ? 0.6 : 1,
                    },
                    style,
                ]}
                {...rest}
            />
            {supportingText && (
                <TText
                    style={[
                        styles.supporting,
                        { color: statusColor ?? tokens.text.secondary },
                        hasError ? styles.error : undefined,
                        descriptionStyle,
                        hasError ? errorStyle : undefined,
                    ]}>
                    {supportingText}
                </TText>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 4,
    },
    input: {
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        lineHeight: 22,
    },
    supporting: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
    error: {
        fontWeight: '500',
    },
})

export default ThemedTextInput
