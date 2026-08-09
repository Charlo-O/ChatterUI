import { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import { Storage } from '@lib/enums/Storage'
import { Logger } from '@lib/state/Logger'
import { createMMKVStorage } from '@lib/storage/MMKV'

import { DefaultColorSchemes, ThemeColor, themeColorSchemaV1 } from './ThemeColor'

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
        const systemTheme = useColorScheme()
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

        return useMemo(
            () => ({ color, spacing, font, borderWidth, fontSize, borderRadius }),
            [color]
        )
    }
}
