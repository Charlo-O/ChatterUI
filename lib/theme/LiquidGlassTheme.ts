/**
 * Fable visual vocabulary, adapted for ChatterUI's existing native runtime.
 * Reference: extra/liquid-glass-chat-ui/src/cookbooks/fable/constants/theme.ts.
 * Keep the upstream notice in docs/THIRD_PARTY_UI.md.
 */
export const LiquidGlassPalette = {
    light: {
        background: '#F2F2F4',
        surface: '#FFFFFF',
        label: '#101012',
        secondary: '#78787E',
        muted: '#8A8A90',
        disabled: '#B4B4BA',
        hairline: '#10101214',
        chip: '#1010120F',
        outgoing: '#141416',
        outgoingText: '#FFFFFF',
        panelEnd: '#EDEDEF',
        grabber: '#1010121F',
        glass: '#F7F7F9D9',
        glassBorder: '#FFFFFFCC',
        inset: '#EBEBEF',
        shadow: '#101012',
    },
    dark: {
        background: '#0A0A0C',
        surface: '#18181B',
        label: '#F5F5F7',
        secondary: '#A0A0A8',
        muted: '#8E8E93',
        disabled: '#5C5C61',
        hairline: '#F5F5F71A',
        chip: '#F5F5F714',
        outgoing: '#F5F5F7',
        outgoingText: '#101012',
        panelEnd: '#111114',
        grabber: '#F5F5F729',
        glass: '#28282CDD',
        glassBorder: '#FFFFFF24',
        inset: '#28282D',
        shadow: '#000000',
    },
} as const

export const LiquidGlassRadius = {
    bubble: 26,
    card: 28,
    panel: 40,
    pill: 999,
} as const

export const createLiquidGlassTheme = (dark: boolean) => ({
    ...LiquidGlassPalette[dark ? 'dark' : 'light'],
    dark,
    scheme: dark ? ('dark' as const) : ('light' as const),
    accent: '#0A84FF',
    radius: LiquidGlassRadius,
})
