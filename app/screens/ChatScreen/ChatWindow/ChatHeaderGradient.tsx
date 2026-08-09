import { View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

const ChatHeaderGradient = () => {
    const { color } = Theme.useTheme()
    return (
        <View
            style={{
                position: 'absolute',
                width: '100%',
                top: 0,
                height: 1,
                backgroundColor: color.neutral._400,
            }}
        />
    )
}

export default ChatHeaderGradient
