import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { SplashScreen, Stack } from 'expo-router'
import { setOptions } from 'expo-splash-screen'
import { useEffect, useState, type ReactNode } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { AlertProvider } from '@components/views/Alert'
import { PortalHost } from '@components/views/Portal'
import { db, dbReady } from '@db'
import { I18nProvider } from '@lib/i18n'
import { useAppStateNotificationObserver } from '@lib/notifications/Notifications'
import { Theme } from '@lib/theme/ThemeManager'

import migrations from '../db/migrations/migrations'

SplashScreen.preventAutoHideAsync()
setOptions({
    fade: true,
    duration: 350,
})

const Layout = () => {
    return (
        <I18nProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                    <DatabaseReadyGate>
                        <AppContent />
                    </DatabaseReadyGate>
                </KeyboardProvider>
            </GestureHandlerRootView>
        </I18nProvider>
    )
}

const AppContent = () => {
    const { astryx } = Theme.useTheme()
    // Notification handlers can touch chat state immediately after mount. Keep
    // them behind the database/migration gate so a deep link or cold start
    // cannot race schema initialization.
    useAppStateNotificationObserver()
    return (
        <>
            <AlertProvider />
            <Stack
                screenOptions={{
                    headerBackButtonDisplayMode: 'minimal',
                    headerStyle: { backgroundColor: astryx.background.surface },
                    headerTitleStyle: {
                        color: astryx.text.primary,
                        fontSize: 15,
                        fontWeight: '600',
                    },
                    headerTintColor: astryx.text.primary,
                    contentStyle: { backgroundColor: astryx.background.body },
                    headerShadowVisible: false,
                    headerTitleAlign: 'center',
                    statusBarStyle: 'auto',
                }}>
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
            </Stack>
            <PortalHost />
        </>
    )
}

const DatabaseReadyGate = ({ children }: { children: ReactNode }) => {
    const { astryx } = Theme.useTheme()
    const [ready, setReady] = useState(false)
    const [error, setError] = useState<Error>()

    useEffect(() => {
        let active = true
        void dbReady.then(async () => {
            try {
                await migrate(db, migrations)
                void SplashScreen.hideAsync()
                if (active) setReady(true)
            } catch (reason) {
                void SplashScreen.hideAsync()
                if (active) {
                    setError(reason instanceof Error ? reason : new Error(String(reason)))
                }
            }
        }).catch((reason) => {
            void SplashScreen.hideAsync()
            if (active) {
                setError(reason instanceof Error ? reason : new Error(String(reason)))
            }
        })
        return () => {
            active = false
        }
    }, [])

    if (error) {
        return (
            <View
                accessibilityRole="alert"
                style={{
                    alignItems: 'center',
                    backgroundColor: astryx.background.body,
                    flex: 1,
                    justifyContent: 'center',
                    padding: 24,
                }}>
                <Text style={{ color: astryx.text.primary, fontSize: 18, fontWeight: '600' }}>
                    Database unavailable
                </Text>
                <Text
                    selectable
                    style={{
                        color: astryx.text.secondary,
                        marginTop: 8,
                        maxWidth: 560,
                        textAlign: 'center',
                    }}>
                    {error.message}
                </Text>
            </View>
        )
    }

    if (!ready) {
        return (
            <View
                accessibilityRole="progressbar"
                style={{
                    alignItems: 'center',
                    backgroundColor: astryx.background.body,
                    flex: 1,
                    gap: 12,
                    justifyContent: 'center',
                }}>
                <ActivityIndicator color={astryx.brand.primary} />
                <Text style={{ color: astryx.text.secondary }}>Loading workspace…</Text>
            </View>
        )
    }

    return <>{children}</>
}

export default Layout
