import { Platform, Pressable, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useAppMode } from '@lib/state/AppMode'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

import ChatAttachments from './ChatAttachments'
import { useChatEditorStore } from './ChatEditor'
import ChatQuickActions, { useChatActionsState } from './ChatQuickActions'
import ChatSwipes from './ChatSwipes'
import ChatText from './ChatText'
import ChatTextLast from './ChatTextLast'

type ChatTextProps = {
    index: number
    nowGenerating: boolean
    isLastMessage: boolean
    isGreeting: boolean
}

const ChatBubble: React.FC<ChatTextProps> = ({
    index,
    nowGenerating,
    isLastMessage,
    isGreeting,
}) => {
    const message = Chats.useEntryData(index)
    const { appMode } = useAppMode()
    const [showTPS] = useMMKVBoolean(AppSettings.ShowTokenPerSecond)
    const { glass, fontSize } = Theme.useTheme()
    const tokens = useAstryxTokens()

    const { setShowOptions } = useChatActionsState(
        useShallow((state) => ({
            setShowOptions: state.setActiveIndex,
        }))
    )

    const showEditor = useChatEditorStore((state) => state.show)
    const handleEnableEdit = () => {
        if (!nowGenerating) showEditor(index)
    }

    const hasSwipes = message?.swipes?.length > 1
    const showSwipe = !message.is_user && isLastMessage && (hasSwipes || !isGreeting)
    const timings = message.swipes[message.swipe_id].timings

    return (
        <View>
            <Pressable
                role={Platform.OS === 'web' ? 'group' : 'button'}
                accessibilityLabel={`${message.name} message`}
                accessibilityHint="Press Enter for message actions, or long press to edit"
                onPress={() => {
                    setShowOptions(nowGenerating ? undefined : index)
                }}
                style={({ pressed }) => ({
                    backgroundColor: message.is_user ? glass.outgoing : glass.surface,
                    borderWidth: 0,
                    marginBottom: showSwipe ? 0 : 4,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    minHeight: 44,
                    borderRadius: tokens.radius.chat,
                    opacity: pressed ? 0.86 : 1,
                    boxShadow: [
                        {
                            offsetX: 0,
                            offsetY: 8,
                            color: message.is_user ? 'transparent' : glass.shadow + '08',
                            blurRadius: 24,
                        },
                    ],
                })}
                onLongPress={handleEnableEdit}>
                {isLastMessage ? (
                    <ChatTextLast nowGenerating={nowGenerating} index={index} />
                ) : (
                    <ChatText nowGenerating={nowGenerating} index={index} />
                )}
                <ChatAttachments index={index} />
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    {showTPS && appMode === 'local' && timings && (
                        <Text
                            style={{
                                color: message.is_user ? glass.outgoingText : glass.secondary,
                                fontWeight: '300',
                                textAlign: 'right',
                                fontSize: fontSize.s,
                            }}>
                            {`Prompt: ${getFiniteValue(timings.prompt_per_second)} t/s`}
                            {`   Text Gen: ${getFiniteValue(timings.predicted_per_second)} t/s`}
                        </Text>
                    )}
                </View>
            </Pressable>
            <ChatQuickActions
                nowGenerating={nowGenerating}
                isLastMessage={isLastMessage}
                index={index}
            />
            {showSwipe && (
                <ChatSwipes index={index} nowGenerating={nowGenerating} isGreeting={isGreeting} />
            )}
        </View>
    )
}

const getFiniteValue = (value: number | null) => {
    if (!value || !isFinite(value)) return (0).toFixed(2)
    return value.toFixed(2)
}

export default ChatBubble
