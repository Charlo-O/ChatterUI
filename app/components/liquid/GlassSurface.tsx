import { BlurView } from 'expo-blur'
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect'
import { useEffect, useState } from 'react'
import { AccessibilityInfo, Platform, StyleSheet, View, type ViewProps } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

const nativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable()

/** Fable's glass material, with readable fallbacks on every supported platform. */
export default function GlassSurface({
    children,
    style,
    interactive = false,
    ...props
}: ViewProps & { interactive?: boolean }) {
    const { glass } = Theme.useTheme()
    const [reduceTransparency, setReduceTransparency] = useState(false)

    useEffect(() => {
        if (Platform.OS !== 'ios') return
        let active = true
        void AccessibilityInfo.isReduceTransparencyEnabled().then((value) => {
            if (active) setReduceTransparency(value)
        })
        const subscription = AccessibilityInfo.addEventListener(
            'reduceTransparencyChanged',
            setReduceTransparency
        )
        return () => {
            active = false
            subscription.remove()
        }
    }, [])

    if (nativeGlass && !reduceTransparency) {
        return (
            <GlassView
                {...props}
                colorScheme={glass.scheme}
                glassEffectStyle="regular"
                isInteractive={interactive}
                style={[styles.base, style]}>
                {children}
            </GlassView>
        )
    }

    return (
        <View
            {...props}
            style={[
                styles.base,
                { borderWidth: 1, borderColor: glass.glassBorder },
                style,
                { overflow: 'hidden' },
            ]}>
            {!reduceTransparency && Platform.OS !== 'android' && (
                <BlurView
                    pointerEvents="none"
                    intensity={40}
                    tint={glass.scheme}
                    style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                />
            )}
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: reduceTransparency ? glass.surface : glass.glass,
                        zIndex: -1,
                    },
                ]}
            />
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    base: { borderCurve: 'continuous', position: 'relative', zIndex: 0 },
})
