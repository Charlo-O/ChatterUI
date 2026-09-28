import { useMemo, useSyncExternalStore } from 'react'
import { Appearance } from 'react-native'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import { Storage } from '@lib/enums/Storage'
import { Logger } from '@lib/state/Logger'
import { createMMKVStorage } from '@lib/storage/MMKV'

import { createLiquidGlassTheme } from './LiquidGlassTheme'
import { DefaultColorSchemes, ThemeColor, themeColorSchemaV1 } from './ThemeColor'

// RN Web's useColorScheme re-subscribes after every render and can miss an
// appearance change during a simultaneous viewport update. A stable external
// store subscription also rechecks the snapshot after committing each screen.
const subscribeAppearance = (onChange: () => void) => {
    const subscription = Appearance.addChangeListener(onChange)
    return () => subscription.remove()
}
const getServerAppearance = () => 'light' as const

/**
 * Semantic compatibility tokens used throughout the app.
 *
 * The legacy `ThemeColor` object remains the source of truth for the existing
 * screens and is intentionally kept unchanged.  These tokens are an adapter
 * layer: consumers can opt into semantic names without having to know about
 * the `_100` … `_900` colour ramps used by the persisted theme format.
 */
export interface AstryxSemanticTokens {
    dark: boolean
    background: {
        body: string
        surface: string
        card: string
        muted: string
        popover: string
    }
    text: {
        primary: string
        secondary: string
        muted: string
        disabled: string
    }
    accent: {
        primary: string
        onPrimary: string
        muted: string
    }
    brand: {
        primary: string
        onPrimary: string
    }
    border: {
        default: string
        emphasized: string
        focus: string
    }
    status: {
        success: string
        warning: string
        error: string
    }
    radius: {
        none: number
        inner: number
        element: number
        container: number
        page: number
        chat: number
        full: number
    }
    /** Astryx spacing scale (CSS spacing-0 … spacing-12, in dp on native). */
    spacing: {
        zero: number
        hairline: number
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
        xxl: number
        xxxl: number
        /** Numeric aliases make porting web examples straightforward. */
        [key: string]: number
    }
    size: {
        sm: number
        md: number
        lg: number
    }
    /** Shadow colours are represented as RN-compatible colours, not CSS box shadows. */
    shadow: {
        low: string
        med: string
        high: string
    }
    font: {
        body: string
        heading: string
        code: string
    }
}

const ASTRYX_RADIUS: AstryxSemanticTokens['radius'] = {
    none: 0,
    inner: 16,
    element: 22,
    container: 28,
    page: 40,
    chat: 26,
    full: 9999,
}

const ASTRYX_SPACING: AstryxSemanticTokens['spacing'] = {
    zero: 0,
    none: 0,
    hairline: 2,
    xs: 4,
    s: 6,
    sm: 8,
    m: 10,
    md: 12,
    l: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    '2xl': 24,
    '3xl': 32,
    '0': 0,
    '0.5': 2,
    '1': 4,
    '1.5': 6,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '7': 28,
    '8': 32,
    '9': 36,
    '10': 40,
    '11': 44,
    '12': 48,
}

const ASTRYX_SIZE: AstryxSemanticTokens['size'] = { sm: 44, md: 44, lg: 48 }

const ASTRYX_FONT: AstryxSemanticTokens['font'] = {
    body: 'system',
    heading: 'system',
    code: 'monospace',
}

const createAstryxTokens = (dark: boolean): AstryxSemanticTokens => {
    const glass = createLiquidGlassTheme(dark)
    return {
        dark,
        background: {
            body: glass.background,
            surface: glass.surface,
            card: glass.surface,
            muted: glass.inset,
            popover: glass.surface,
        },
        text: {
            primary: glass.label,
            secondary: glass.secondary,
            muted: glass.muted,
            disabled: glass.disabled,
        },
        accent: { primary: glass.outgoing, onPrimary: glass.outgoingText, muted: glass.chip },
        brand: { primary: glass.accent, onPrimary: '#FFFFFF' },
        border: {
            default: glass.hairline,
            emphasized: dark ? '#48484E' : '#D4D4DA',
            focus: glass.accent,
        },
        status: {
            success: dark ? '#5CD685' : '#258342',
            warning: dark ? '#E9BA57' : '#916705',
            error: dark ? '#FF938C' : '#C63D38',
        },
        radius: ASTRYX_RADIUS,
        spacing: ASTRYX_SPACING,
        size: ASTRYX_SIZE,
        shadow: {
            low: dark ? '#00000040' : '#0000001A',
            med: dark ? '#00000059' : '#00000026',
            high: dark ? '#000000B3' : '#0000003D',
        },
        font: ASTRYX_FONT,
    }
}

/** Best-effort luminance check for custom persisted schemes. */
const isDarkThemeColor = (themeColor: ThemeColor): boolean => {
    const hex = themeColor.neutral?._100
    if (!hex) return false
    const compact = hex.replace('#', '')
    const normalized =
        compact.length === 3
            ? compact
                  .split('')
                  .map((digit) => `${digit}${digit}`)
                  .join('')
            : compact
    if (normalized.length !== 6) return false
    const [r, g, b] = [0, 2, 4].map((offset) =>
        Number.parseInt(normalized.slice(offset, offset + 2), 16)
    )
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 120
}

interface ColorStateProps {
    useSystemDarkMode: boolean
    setUseSystemDarkMode: (b: boolean) => void
    customColors: ThemeColor[]
    addCustomColor: (colorScheme: ThemeColor) => void
    removeColorScheme: (index: number) => void
    color: ThemeColor
    lightColor: ThemeColor
    darkColor: ThemeColor
    setColor: (colorScheme: ThemeColor) => void
    setLightColor: (colorScheme: ThemeColor) => void
    setDarkColor: (colorScheme: ThemeColor) => void
}

export const useGlobalStyles = () => {
    // todo: find common items to add here
    // const { color, spacing, borderWidth, borderRadius } = Theme.useTheme()
}

export namespace Theme {
    export const useColorState = create<ColorStateProps>()(
        persist(
            (set, get) => ({
                useSystemDarkMode: true,
                color: DefaultColorSchemes.noocLight,
                darkColor: DefaultColorSchemes.noocDark,
                lightColor: DefaultColorSchemes.noocLight,
                setColor: (color) => {
                    set({ color: color })
                },
                setLightColor: (color) => {
                    set({ lightColor: color })
                },
                setDarkColor: (color) => {
                    set({ darkColor: color })
                },
                setUseSystemDarkMode: (b) => {
                    set({ useSystemDarkMode: b })
                },

                customColors: [],
                addCustomColor: (colorScheme: ThemeColor) => {
                    const validation = themeColorSchemaV1.safeParse(colorScheme)

                    if (!validation.success) {
                        Logger.errorToast(`Schema validation failed!`)
                        Logger.error(
                            'The format of the imported JSON does not match the required color scheme:\n' +
                                validation.error.issues
                                    .map((issue) => `${issue.path.join('.')} - ${issue.message}`)
                                    .join('\n')
                        )
                        return
                    }

                    if (
                        get().customColors.some((item) => item.name === colorScheme.name) ||
                        DefaultColorSchemes.schemes.some((item) => item.name === colorScheme.name)
                    ) {
                        Logger.errorToast('Color Name Already Used')
                        return
                    }
                    set({ customColors: [...get().customColors, colorScheme] })
                    Logger.info(`Successfully imported ${colorScheme.name}`)
                },
                removeColorScheme: (index: number) => {
                    if (index > get().customColors.length) {
                        return
                    }
                    const colors = [...get().customColors]
                    const removedArr = colors.splice(index, 1)
                    const removed = removedArr?.[0]
                    let color = get().color
                    let lightColor = get().lightColor
                    let darkColor = get().darkColor
                    if (removed) {
                        if (removed.name === color.name) color = DefaultColorSchemes.noocLight
                        if (removed.name === lightColor.name)
                            lightColor = DefaultColorSchemes.noocLight
                        if (removed.name === darkColor.name)
                            darkColor = DefaultColorSchemes.noocDark
                    }
                    set({
                        customColors: colors,
                        color: color,
                        lightColor: lightColor,
                        darkColor: darkColor,
                    })
                },
            }),
            {
                name: Storage.ColorState,
                storage: createMMKVStorage(),
                version: 3,
                partialize: (state) => ({
                    color: state.color,
                    customColors: state.customColors,
                    darkColor: state.darkColor,
                    lightColor: state.lightColor,
                    useSystemDarkMode: state.useSystemDarkMode,
                }),
                migrate: (persistedState: any, version) => {
                    if (version === 1) {
                        persistedState.darkColor = DefaultColorSchemes.noocDark
                        persistedState.lightColor = DefaultColorSchemes.noocLight
                        persistedState.useSystemDarkMode = false
                    }
                    if (version < 3) {
                        if (
                            persistedState.color?.name === DefaultColorSchemes.lavenderDark.name ||
                            persistedState.color?.name === DefaultColorSchemes.lavenderLight.name
                        ) {
                            persistedState.color = DefaultColorSchemes.noocLight
                        }
                        if (
                            persistedState.lightColor?.name ===
                            DefaultColorSchemes.lavenderLight.name
                        ) {
                            persistedState.lightColor = DefaultColorSchemes.noocLight
                        }
                        if (
                            persistedState.darkColor?.name === DefaultColorSchemes.lavenderDark.name
                        ) {
                            persistedState.darkColor = DefaultColorSchemes.noocDark
                        }
                    }
                    return persistedState
                },
            }
        )
    )
    // TODO: State-ify
    const spacing = {
        xs: 4,
        s: 6,
        sm: 8,
        m: 10,
        l: 12,
        xl: 16,
        xl2: 24,
        xl3: 32,
    }

    const borderWidth = {
        s: 1,
        m: 1,
        l: 2,
        xl: 4,
    }

    const borderRadius = {
        s: 8,
        m: 12,
        l: 18,
        xl: 22,
        xl2: 28,
        xl3: 32,
    }

    const fontSize = { s: 12, m: 14, l: 16, xl: 18, xl2: 20, xl3: 24 }

    const font = ''

    export const useTheme = () => {
        const systemTheme = useSyncExternalStore(
            subscribeAppearance,
            Appearance.getColorScheme,
            getServerAppearance
        )
        const { selectedColor, useSystemDarkMode, lightColor, darkColor } = useColorState(
            useShallow((state) => ({
                selectedColor: state.color,
                useSystemDarkMode: state.useSystemDarkMode,
                lightColor: state.lightColor,
                darkColor: state.darkColor,
            }))
        )

        const color = useSystemDarkMode
            ? systemTheme === 'dark'
                ? darkColor
                : lightColor
            : selectedColor

        // Fable's neutral palette follows the active appearance. We
        // intentionally keep this separate from `color`: persisted/custom
        // ThemeColor schemes continue to drive all legacy consumers exactly as
        // before, while migrated consumers get stable semantic names.
        const astryx = useMemo(
            () =>
                createAstryxTokens(
                    useSystemDarkMode ? systemTheme === 'dark' : isDarkThemeColor(selectedColor)
                ),
            [selectedColor, systemTheme, useSystemDarkMode]
        )

        const glass = useMemo(() => createLiquidGlassTheme(astryx.dark), [astryx.dark])

        return useMemo(
            () => ({ color, spacing, font, borderWidth, fontSize, borderRadius, astryx, glass }),
            [color, astryx, glass]
        )
    }
}
