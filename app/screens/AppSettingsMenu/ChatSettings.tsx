import ThemedSwitch from '@components/input/ThemedSwitch'
import SectionTitle from '@components/text/SectionTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useTranslation } from '@lib/hooks/useTranslation'
import React from 'react'
import { View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

const ChatSettings = () => {
    const { t } = useTranslation()
    const [firstMes, setFirstMes] = useMMKVBoolean(AppSettings.CreateFirstMes)
    const [chatOnStartup, setChatOnStartup] = useMMKVBoolean(AppSettings.ChatOnStartup)
    const [autoScroll, setAutoScroll] = useMMKVBoolean(AppSettings.AutoScroll)
    const [sendOnEnter, setSendOnEnter] = useMMKVBoolean(AppSettings.SendOnEnter)
    const [autoLoadUser, setAutoLoadUser] = useMMKVBoolean(AppSettings.AutoLoadUser)

    const [showTokensPerSecond, setShowTokensPerSecond] = useMMKVBoolean(
        AppSettings.ShowTokenPerSecond
    )

    return (
        <View style={{ rowGap: 8 }}>
            <SectionTitle>{t('settings.chatSettings')}</SectionTitle>

            <ThemedSwitch
                label={t('settings.autoScroll')}
                value={autoScroll}
                onChangeValue={setAutoScroll}
                description={t('settings.autoScrollDescription')}
            />

            <ThemedSwitch
                label={t('settings.useFirstMessage')}
                value={firstMes}
                onChangeValue={setFirstMes}
                description={t('settings.useFirstMessageDescription')}
            />

            <ThemedSwitch
                label={t('settings.loadChatOnStartup')}
                value={chatOnStartup}
                onChangeValue={setChatOnStartup}
                description={t('settings.loadChatOnStartupDescription')}
            />

            <ThemedSwitch
                label={t('settings.autoLoadUser')}
                value={autoLoadUser}
                onChangeValue={setAutoLoadUser}
                description={t('settings.autoLoadUserDescription')}
            />

            <ThemedSwitch
                label={t('settings.sendOnEnter')}
                value={sendOnEnter}
                onChangeValue={setSendOnEnter}
                description={t('settings.sendOnEnterDescription')}
            />

            <ThemedSwitch
                label={t('settings.showTokensPerSecond')}
                value={showTokensPerSecond}
                onChangeValue={setShowTokensPerSecond}
                description={t('settings.showTokensPerSecondDescription')}
            />
        </View>
    )
}

export default ChatSettings
