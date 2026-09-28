import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { AccessibilityState, Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

type HorizontalSelectorProps<T> = {
    values: {
        label: string
        value: T
        icon?: keyof typeof MaterialIcons.glyphMap
        iconSize?: number
    }[]
    selected: T
    onPress: (selected: T) => void
    label?: string
    description?: string
    style?: ViewStyle
    capitalizeValues?: string
    accessibilityLabel?: string
    accessibilityHint?: string
    accessibilityState?: AccessibilityState
}

const HorizontalSelector = <T,>({
    values,
    selected,
    onPress,
    label,
    description,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
}: HorizontalSelectorProps<T>) => {
    const { astryx: tokens } = Theme.useTheme()
    const viewRef = useRef<View>(null)
    const initialRender = useRef(true)
    const animatedValues = useSharedValue({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    })
    const animatedStyle = useAnimatedStyle(() => {
        return animatedValues.value
    })

    useEffect(() => {
        if (!viewRef.current) return
        viewRef.current.measure((x, y, width, height) => {
            animatedValues.value = withTiming(
                {
                    top: y,
                    left: x,
                    width: width - tokens.spacing.hairline * 2,
                    height: height - tokens.spacing.hairline * 2,
                },
                { duration: initialRender.current ? 0 : 180, easing: Easing.out(Easing.exp) }
            )
        })
        initialRender.current = false
    }, [animatedValues, selected, tokens.spacing.hairline])

    return (
        <View style={[styles.container, style]}>
            {label && <TText style={[styles.label, { color: tokens.text.primary }]}>{label}</TText>}

            <View
                accessibilityRole="tablist"
                accessibilityLabel={accessibilityLabel ?? label ?? 'Selector'}
                accessibilityHint={accessibilityHint}
                accessibilityState={accessibilityState}
                style={[
                    styles.selector,
                    {
                        backgroundColor: tokens.background.muted,
                        borderColor: tokens.border.default,
                        borderRadius: tokens.radius.full,
                        marginTop: tokens.spacing.sm,
                    },
                ]}>
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.selectionIndicator,
                        {
                            backgroundColor: tokens.accent.primary,
                            borderRadius: tokens.radius.full,
                        },
                        animatedStyle,
                    ]}
                />

                {values.map((item, index) => {
                    const isSelected = item.value === selected
                    return (
                        <Pressable
                            accessibilityRole="tab"
                            accessibilityLabel={item.label}
                            accessibilityState={{ selected: isSelected }}
                            ref={isSelected ? viewRef : null}
                            key={index}
                            onPress={() => onPress(item.value)}
                            style={[
                                styles.option,
                                {
                                    paddingVertical: tokens.spacing.sm,
                                    paddingHorizontal: tokens.spacing.md,
                                },
                            ]}>
                            {item.icon && (
                                <MaterialIcons
                                    name={item.icon}
                                    size={item.iconSize ?? 16}
                                    color={
                                        isSelected ? tokens.accent.onPrimary : tokens.text.secondary
                                    }
                                />
                            )}
                            <TText
                                style={{
                                    color: isSelected
                                        ? tokens.accent.onPrimary
                                        : tokens.text.secondary,
                                    fontSize: 14,
                                    fontWeight: isSelected ? '600' : '500',
                                }}>
                                {item.label}
                            </TText>
                        </Pressable>
                    )
                })}
            </View>

            {description && (
                <TText
                    style={[
                        styles.description,
                        {
                            color: tokens.text.secondary,
                            marginTop: tokens.spacing.xs,
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
        flex: 1,
    },
    label: {
        lineHeight: 20,
    },
    selector: {
        alignItems: 'stretch',
        borderWidth: 1,
        minHeight: 44,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        position: 'relative',
    },
    selectionIndicator: {
        bottom: 2,
        left: 2,
        position: 'absolute',
        right: 2,
        top: 2,
    },
    option: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        columnGap: 8,
        zIndex: 1,
    },
    description: {
        lineHeight: 18,
    },
})

export default HorizontalSelector
