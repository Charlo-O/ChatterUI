import { Text, View } from 'react-native'

import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

const ChatFooter = () => {
    const { chat } = Chats.useChat()
    const { glass } = Theme.useTheme()
    const firstDate = chat?.messages[0]?.swipes[0]?.send_date
    const label = !firstDate ? 'Send a message to begin' : firstDate.toDateString() === new Date().toDateString() ? 'Today' : firstDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

    return (
        <View
            style={{
                paddingVertical: 16,
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
            }}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: glass.muted }}>{label}</Text>
        </View>
    )
}

export default ChatFooter
