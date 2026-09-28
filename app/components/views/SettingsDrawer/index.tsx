import { Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import SupportButton from '@components/buttons/SupportButton'
import { AstryxDivider, useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'

import AppModeToggle from './AppModeToggle'
import RouteList from './RouteList'
import UserInfo from './UserInfo'

const SettingsDrawer = () => {
    const { spacing } = Theme.useTheme()
    const tokens = useAstryxTokens()
    const [devMode] = useMMKVBoolean(AppSettings.DevMode)

    return (
        <Drawer.Body
            drawerID={Drawer.ID.SETTINGS}
            drawerStyle={{
                width: '78%',
                paddingBottom: spacing.xl,
            }}>
            <View style={{ paddingHorizontal: spacing.xl2, paddingBottom: spacing.l }}>
                <Text style={{ color: tokens.text.primary, fontSize: 20, fontWeight: '600' }}>Settings</Text>
                <Text style={{ color: tokens.text.secondary, fontSize: 13, marginTop: 4 }}>Workspace and runtime controls</Text>
            </View>
            <UserInfo />
            <AppModeToggle />
            <AstryxDivider style={{ marginHorizontal: spacing.xl2, marginVertical: spacing.m }} />
            <RouteList />
            <Text
                style={{
                    alignSelf: 'center',
                    color: tokens.text.muted,
                    marginTop: spacing.l,
                    marginBottom: spacing.xl,
                    fontSize: 12,
                }}>
                {__DEV__ && 'DEV BUILD\t'}
                {devMode && 'DEV MODE\t'}
                {'v' + appConfig.expo.version}
            </Text>
            <View style={{ marginHorizontal: spacing.xl2 }}>
                <SupportButton />
            </View>
        </Drawer.Body>
    )
}

export default SettingsDrawer
