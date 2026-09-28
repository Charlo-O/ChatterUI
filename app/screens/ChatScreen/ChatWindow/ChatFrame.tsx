import { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import GlassPortrait from '@components/liquid/GlassPortrait'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { useAvatarViewerStore } from '@lib/state/components/AvatarViewer'
import { Theme } from '@lib/theme/ThemeManager'

type ChatFrameProps = {
    children?: ReactNode
    index: number
    nowGenerating: boolean
    isLast?: boolean
}

/** Keep expert metadata in wide mode; the default conversation uses Fable's quiet layout. */
const ChatFrame: React.FC<ChatFrameProps> = ({ children, index, nowGenerating, isLast }) => {
    const { glass } = Theme.useTheme()
    const [wide] = useMMKVBoolean(AppSettings.WideChatMode)
    const [alternate] = useMMKVBoolean(AppSettings.AlternatingChatMode)
    const message = Chats.useEntryData(index)
    const setShowViewer = useAvatarViewerStore((state) => state.setShow)
    const charImageId = Characters.useCharacterStore((state) => state.card?.image_id) ?? 0
    const userImageId = Characters.useUserStore((state) => state.card?.image_id) ?? 0
    const swipe = message.swipes[message.swipe_id]
    const outgoing = message.is_user && (alternate ?? true)
    const deltaTime = Math.round(
        Math.max(
            0,
            ((nowGenerating && isLast ? Date.now() : swipe.gen_finished.getTime()) -
                swipe.gen_started.getTime()) /
                1000
        )
    )
    const image = Characters.getImageDir(message.is_user ? userImageId : charImageId)

    const portrait = (size: number) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={'View ' + message.name + ' avatar'}
            hitSlop={10}
            onPress={() => setShowViewer(true, message.is_user)}>
            <GlassPortrait image={image} size={size} />
        </Pressable>
    )

    if (wide) {
        return (
            <View style={{ width: '100%', gap: 8, paddingVertical: 8 }}>
                <View
                    style={{
                        flexDirection: outgoing ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                    {portrait(32)}
                    <View style={{ flex: 1, alignItems: outgoing ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ fontSize: 15, color: glass.label, fontWeight: '600' }}>
                            {message.name}
                        </Text>
                        <Text style={{ color: glass.secondary, fontSize: 12 }}>
                            {swipe.gen_finished.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}{' '}
                            · #{index}
                            {!message.is_user && index !== 0 ? ' · ' + deltaTime + 's' : ''}
                        </Text>
                    </View>
                </View>
                {children}
            </View>
        )
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: outgoing ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 8,
            }}>
            {!outgoing && portrait(26)}
            <View style={{ maxWidth: outgoing ? '86%' : '82%', flexShrink: 1, minWidth: 56 }}>
                {children}
            </View>
        </View>
    )
}

export default ChatFrame
