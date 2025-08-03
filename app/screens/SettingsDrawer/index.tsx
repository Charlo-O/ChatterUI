import SupportButton from '@components/buttons/SupportButton'
import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useTranslation } from '@lib/hooks/useTranslation'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'
import { Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import AppModeToggle from './AppModeToggle'
import LanguageToggle from './LanguageToggle'
import RouteList from './RouteList'
import UserInfo from './UserInfo'

const SettingsDrawer = () => {
    const { color, spacing } = Theme.useTheme()
    const { t } = useTranslation()

    const [devMode, _] = useMMKVBoolean(AppSettings.DevMode)
    return (
        <Drawer.Body
            drawerID={Drawer.ID.SETTINGS}
            drawerStyle={{
                width: '60%',
                paddingBottom: spacing.xl2,
            }}>
            <UserInfo />
            <AppModeToggle />
            <LanguageToggle />
            <RouteList />
            <Text
                style={{
                    alignSelf: 'center',
                    color: color.text._300,
                    marginTop: spacing.l,
                    marginBottom: spacing.xl2,
                }}>
                {__DEV__ && t('dev.devBuild') + '\t'}
                {devMode && t('dev.devMode') + '\t'}
                {'v' + appConfig.expo.version}
            </Text>
            <View style={{ marginHorizontal: spacing.xl2 }}>
                <SupportButton />
            </View>
        </Drawer.Body>
    )
}

export default SettingsDrawer
