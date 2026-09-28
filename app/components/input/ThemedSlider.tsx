import Slider from '@react-native-community/slider'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import type { AccessibilityActionEvent } from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

type ThemedSliderProps = {
    label: string
    value: number
    onValueChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    precision?: number
    showInput?: boolean
    disabled?: boolean
    accessibilityLabel?: string
    accessibilityHint?: string
}

const clamp = (value: number, min: number, max: number, precision: number, step = 0) => {
    if (!Number.isFinite(value)) return min
    const rounded = Number(value.toFixed(Math.max(0, precision)))
    const stepped = step > 0 ? min + Math.round((rounded - min) / step) * step : rounded
    return Math.min(Math.max(Number(stepped.toFixed(Math.max(0, precision))), min), max)
}

const ThemedSlider: React.FC<ThemedSliderProps> = ({
    label,
    value,
    onValueChange,
    min = 0,
    max = 1,
    step = 0,
    precision = 0,
    showInput = true,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
}) => {
    const { astryx: tokens } = Theme.useTheme()
    const [textValue, setTextValue] = useState(String(value))
    const [sliderValue, setSliderValue] = useState(() => clamp(value, min, max, precision, step))
    const textValueRef = useRef(String(value))
    const pendingTextValue = useRef<string | null>(null)
    const pendingSliderCommit = useRef<ReturnType<typeof setTimeout> | null>(null)

    const updateTextValue = (nextValue: string) => {
        textValueRef.current = nextValue
        setTextValue(nextValue)
    }

    const clampValue = useCallback(
        (nextValue: number) => clamp(nextValue, min, max, precision, step),
        [min, max, precision, step]
    )

    const clearPendingSliderCommit = () => {
        if (pendingSliderCommit.current) {
            clearTimeout(pendingSliderCommit.current)
            pendingSliderCommit.current = null
        }
    }

    useEffect(() => () => clearPendingSliderCommit(), [])

    useEffect(() => {
        setSliderValue(clampValue(value))
    }, [clampValue, value])

    useEffect(() => {
        const pending = pendingTextValue.current
        const parsedPending = Number.parseFloat(textValueRef.current)
        const currentValue = clampValue(value)
        const pendingIsInRange =
            Number.isFinite(parsedPending) && parsedPending >= min && parsedPending <= max
        if (
            pending !== null &&
            pending === textValueRef.current &&
            pendingIsInRange &&
            clampValue(parsedPending) === currentValue
        ) {
            pendingTextValue.current = null
            return
        }
        pendingTextValue.current = null
        updateTextValue(String(currentValue))
    }, [clampValue, max, min, value])

    const handleSliderValueChange = (nextValue: number) => {
        const next = clampValue(nextValue)
        if (Number.isFinite(next)) {
            setSliderValue(next)
            pendingTextValue.current = null
            updateTextValue(String(next))
            clearPendingSliderCommit()
            pendingSliderCommit.current = setTimeout(() => {
                pendingSliderCommit.current = null
                onValueChange(next)
            }, 250)
        }
    }

    const handleSliderComplete = (nextValue: number) => {
        const next = clampValue(nextValue)
        clearPendingSliderCommit()
        setSliderValue(next)
        pendingTextValue.current = null
        updateTextValue(String(next))
        onValueChange(next)
    }

    const handleSliderAccessibilityAction = (event: AccessibilityActionEvent) => {
        if (event.nativeEvent.actionName === 'increment') {
            handleSliderComplete(sliderValue + (step || (max - min) / 100))
        } else if (event.nativeEvent.actionName === 'decrement') {
            handleSliderComplete(sliderValue - (step || (max - min) / 100))
        }
    }

    const handleTextInputChange = (nextText: string) => {
        clearPendingSliderCommit()
        pendingTextValue.current = nextText
        updateTextValue(nextText)
        const parsed = Number.parseFloat(nextText)
        if (Number.isFinite(parsed)) onValueChange(clampValue(parsed))
    }

    const commitTextValue = () => {
        clearPendingSliderCommit()
        const parsed = Number.parseFloat(textValueRef.current)
        const next = Number.isFinite(parsed) ? clampValue(parsed) : clampValue(value)
        pendingTextValue.current = null
        onValueChange(next)
        updateTextValue(String(next))
    }

    const resolvedLabel = accessibilityLabel ?? label

    return (
        <View style={styles.container}>
            {!!label && (
                <TText
                    style={[
                        styles.label,
                        { color: disabled ? tokens.text.disabled : tokens.text.primary },
                    ]}>
                    {label}
                </TText>
            )}
            <View style={styles.sliderContainer}>
                <Slider
                    disabled={disabled}
                    style={styles.slider}
                    step={step}
                    minimumValue={min}
                    maximumValue={max}
                    value={sliderValue}
                    onValueChange={handleSliderValueChange}
                    onSlidingComplete={handleSliderComplete}
                    minimumTrackTintColor={disabled ? tokens.text.disabled : tokens.accent.primary}
                    maximumTrackTintColor={tokens.border.emphasized}
                    thumbTintColor={disabled ? tokens.text.disabled : tokens.accent.primary}
                    accessibilityLabel={resolvedLabel}
                    accessibilityHint={accessibilityHint}
                    accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
                    onAccessibilityAction={handleSliderAccessibilityAction}
                    accessibilityValue={{ min, max, now: sliderValue }}
                />
                {showInput && (
                    <TextInput
                        editable={!disabled}
                        accessibilityLabel={`${resolvedLabel} value`}
                        accessibilityHint={accessibilityHint}
                        accessibilityState={{ disabled }}
                        style={[
                            styles.textBox,
                            {
                                borderColor: disabled
                                    ? tokens.border.emphasized
                                    : tokens.border.default,
                                color: disabled ? tokens.text.disabled : tokens.text.primary,
                                backgroundColor: tokens.background.surface,
                                opacity: disabled ? 0.6 : 1,
                            },
                        ]}
                        value={textValue}
                        onChangeText={handleTextInputChange}
                        keyboardType={step > 0 && (precision > 0 || step < 1) ? 'decimal-pad' : 'number-pad'}
                        submitBehavior="blurAndSubmit"
                        onEndEditing={commitTextValue}
                        onSubmitEditing={commitTextValue}
                        onBlur={commitTextValue}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        width: '100%',
    },
    label: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    sliderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 40,
    },
    slider: {
        flex: 1,
        height: 36,
    },
    textBox: {
        borderRadius: 10,
        borderWidth: 1,
        flexBasis: 64,
        minHeight: 32,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
})

export default ThemedSlider
