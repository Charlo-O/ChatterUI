import React from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

import { AstryxScreen } from '@components/astryx/AstryxShell'
import { Theme } from '@lib/theme/ThemeManager'

import CharacterSettings from './CharacterSettings'
import ChatSettings from './ChatSettings'
import ChatWindowSettings from './ChatWindowSettings'
import DatabaseSettings from './DatabaseSettings'
import GeneratingSettings from './GeneratingSettings'
import LanguageSettings from './LanguageSettings'
import NotificationSettings from './NotificationSettings'
import ScreenSettings from './ScreenSettings'
import SecuritySettings from './SecuritySettings'
import StyleSettings from './StyleSettings'

const AppSettingsMenu = () => {
    const { spacing } = Theme.useTheme()

    return (
        <AstryxScreen title="Settings" subtitle="Workspace preferences">
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    rowGap: spacing.sm,
                    paddingHorizontal: spacing.xl2,
                    paddingVertical: spacing.xl2,
                    paddingBottom: spacing.xl3,
                }}>

            <LanguageSettings />
            <StyleSettings />
            <ChatSettings />
            <ChatWindowSettings />
            <CharacterSettings />
            <GeneratingSettings />
            <NotificationSettings />
            <ScreenSettings />
            <DatabaseSettings />
            <SecuritySettings />

            <View style={{ paddingVertical: spacing.xl3 }} />
            </KeyboardAwareScrollView>
        </AstryxScreen>
    )
}

export default AppSettingsMenu
