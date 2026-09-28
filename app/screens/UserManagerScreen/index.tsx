import { SafeAreaView } from 'react-native-safe-area-context'

import { AstryxScreen } from '@components/astryx/AstryxShell'
import Drawer from '@components/views/Drawer'

import UserCardEditor from './UserCardEditor'
import UserDrawer from './UserDrawer'

const UserManagerScreen = () => {
    return (
        <AstryxScreen
            title="Edit User"
            subtitle="Persona and profile"
            showMenu={false}
            actions={
                <Drawer.Button
                    drawerID={Drawer.ID.USERLIST}
                    accessibilityLabel="Open users"
                />
            }>
            <Drawer.Gesture
                config={[
                    { drawerID: Drawer.ID.USERLIST, openDirection: 'left', closeDirection: 'right' },
                ]}>
                <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                    <UserCardEditor />
                    <UserDrawer />
                </SafeAreaView>
            </Drawer.Gesture>
        </AstryxScreen>
    )
}

export default UserManagerScreen
