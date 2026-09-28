import { AntDesign } from '@expo/vector-icons'
import { useEffect } from 'react'
import { AccessibilityState, Pressable, ViewStyle } from 'react-native'
import Animated, {
    BounceIn,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    ZoomOut,
} from 'react-native-reanimated'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

type ThemedCheckboxProps = {
    label?: string
    value: boolean
    onChangeValue?: (item: boolean) => void
    style?: ViewStyle
    accessibilityLabel?: string
    accessibilityHint?: string
    accessibilityState?: AccessibilityState
    disabled?: boolean
}

const ThemedCheckbox: React.FC<ThemedCheckboxProps> = ({
    label = undefined,
    value,
    onChangeValue = () => {},
    style = {},
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    disabled = false,
}) => {
    const { astryx: tokens } = Theme.useTheme()
    const colorChange = useSharedValue(value ? 1 : 0)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                colorChange.value,
                [0, 1],
                [tokens.background.surface, tokens.accent.primary]
            ),
        }
    })

    useEffect(() => {
        // Keep the animation in sync even when a parent controls the value externally.
        colorChange.value = withTiming(value ? 1 : 0, { duration: 100 })
    }, [colorChange, value])

    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={accessibilityLabel ?? label ?? 'Checkbox'}
            accessibilityHint={accessibilityHint}
            accessibilityState={{
                ...(accessibilityState ?? {}),
                checked: value,
                disabled: disabled,
            }}
            disabled={disabled}
            style={{ flexDirection: 'row', alignItems: 'center', opacity: disabled ? 0.52 : 1 }}
            onPress={() => {
                if (!disabled) onChangeValue(!value)
            }}>
            <Animated.View
                style={[
                    {
                        width: tokens.size.md,
                        height: tokens.size.md,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: tokens.spacing.hairline,
                        borderRadius: tokens.radius.inner,
                        borderColor: tokens.border.emphasized,
                        borderWidth: 1,
                        marginVertical: tokens.spacing.sm,
                    },
                    animatedStyle,
                    style,
                ]}>
                {value && (
                    <Animated.View
                        entering={BounceIn.duration(150)}
                        exiting={ZoomOut.duration(150)}>
                        <AntDesign name="check" color={tokens.accent.onPrimary} size={18} />
                    </Animated.View>
                )}
            </Animated.View>
            {label && (
                <TText
                    style={{
                        paddingLeft: tokens.spacing.md,
                        flex: 1,
                        color: disabled
                            ? tokens.text.disabled
                            : value
                              ? tokens.text.primary
                              : tokens.text.secondary,
                    }}>
                    {label}
                </TText>
            )}
        </Pressable>
    )
}

export default ThemedCheckbox
