import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

import ContextMenu from '@components/views/ContextMenu'
import Drawer from '@components/views/Drawer'
import { Theme } from '@lib/theme/ThemeManager'

const ChatOptions = () => {
    const router = useRouter()
    const styles = useStyles()

    const setShow = Drawer.useDrawerStore((state) => state.setShow)

    const setShowChat = (b: boolean) => {
        setShow(Drawer.ID.CHATLIST, b)
    }

    return (
        <ContextMenu
            triggerAccessibilityLabel="Chat options"
            buttons={[
                {
                    onPress: (close) => {
                        close()
                        router.back()
                    },
                    label: 'Main Menu',
                    icon: 'backward',
                },
                {
                    onPress: (close) => {
                        close()
                        router.push('/screens/CharacterEditorScreen')
                    },
                    label: 'Edit Character',
                    icon: 'edit',
                },
                {
                    onPress: (close) => {
                        setShowChat(true)
                        close()
                    },
                    label: 'Chat History',
                    icon: 'paper-clip',
                },
            ]}
            placement="top">
            <Ionicons name="options-outline" style={styles.optionsButton} size={24} />
        </ContextMenu>
    )
}

export default ChatOptions

const useStyles = () => {
    const { glass } = Theme.useTheme()

    return StyleSheet.create({
        optionsButton: {
            color: glass.secondary,
            padding: 10,
            width: 44,
            height: 44,
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderRadius: 999,
        },
    })
}
