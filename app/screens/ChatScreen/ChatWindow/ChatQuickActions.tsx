import { setStringAsync } from 'expo-clipboard'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated, { StretchInY, StretchOutY, ZoomIn, ZoomOut } from 'react-native-reanimated'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import Alert from '@components/views/Alert'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useBackAction } from '@lib/hooks/BackAction'
import { Chats, useInference } from '@lib/state/Chat'
import { Logger } from '@lib/state/Logger'
import { useTTS } from '@lib/state/TTS'
import { Theme } from '@lib/theme/ThemeManager'

import { useChatEditorStore } from './ChatEditor'
import ChatTTS from './ChatTTS'

interface OptionsStateProps {
    activeIndex?: number
    setActiveIndex: (n: number | undefined) => void
}

useInference.subscribe(({ nowGenerating }) => {
    if (nowGenerating) {
        useChatActionsState.getState().setActiveIndex(undefined)
    }
})
export const useChatActionsState = create<OptionsStateProps>()((set, get) => ({
    setActiveIndex: (n) => set({ activeIndex: get().activeIndex === n ? undefined : n }),
}))

interface ChatActionProps {
    index: number
    nowGenerating: boolean
    isLastMessage: boolean
}

const ChatQuickActions: React.FC<ChatActionProps> = ({ index, nowGenerating, isLastMessage }) => {
    const { activeIndex, setShowOptions } = useChatActionsState(
        useShallow((state) => ({
            setShowOptions: state.setActiveIndex,
            activeIndex: state.activeIndex,
        }))
    )
    const showEditor = useChatEditorStore((state) => state.show)
    const { color, glass } = Theme.useTheme()
    const [quickDelete] = useMMKVBoolean(AppSettings.QuickDelete)
    const { deleteEntry } = Chats.useEntry()
    const { chatId, loadChat } = Chats.useChat()
    const { swipe } = Chats.useSwipeData(index)
    const { activeChatIndex } = useTTS()
    const showOptions = activeIndex === index

    const handleEnableEdit = () => {
        if (showOptions) setShowOptions(undefined)
        if (!nowGenerating) showEditor(index)
    }

    const handleFork = () => {
        if (!chatId) return
        Alert.alert({
            title: 'Fork Chat',
            description: 'This will create a clone of this chat from this message',
            buttons: [
                { label: 'Cancel' },
                {
                    label: 'Fork Chat',
                    onPress: async () => {
                        const newChatId = await Chats.db.mutate.cloneChatFromId(chatId, index + 1)
                        if (!newChatId) {
                            Logger.errorToast('Failed to clone chat')
                            return
                        }
                        setShowOptions(undefined)
                        loadChat(newChatId)
                    },
                },
            ],
        })
    }

    const backAction = useCallback(() => {
        if (!showOptions || !swipe) return false
        setShowOptions(undefined)
        return true
    }, [showOptions, setShowOptions, swipe])

    useBackAction(backAction)

    if (!swipe) return

    const isSpeaking = index === activeChatIndex
    if (!isSpeaking && (!showOptions || nowGenerating)) return

    return (
        <View
            style={{
                alignItems: 'flex-start',
                marginVertical: 6,
            }}>
            <Animated.View
                entering={StretchInY.duration(100)}
                exiting={StretchOutY.duration(100)}
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    columnGap: 4,
                    alignItems: 'center',
                    paddingVertical: 4,
                    paddingHorizontal: 4,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: glass.hairline,
                    backgroundColor: glass.surface,
                    boxShadow: [
                        {
                            offsetX: 0,
                            offsetY: 6,
                            color: color.shadow + '1A',
                            blurRadius: 20,
                        },
                    ],
                }}>
                {!(isLastMessage && nowGenerating) && (
                    <>
                        {quickDelete && (
                            <Animated.View
                                style={{ flexDirection: 'row' }}
                                entering={ZoomIn.duration(200)}
                                exiting={ZoomOut.duration(200)}>
                                <ThemedButton
                                    accessibilityLabel="Delete message"
                                    variant="tertiary"
                                    iconName="delete"
                                    iconSize={24}
                                    iconStyle={{
                                        color: color.error._400,
                                    }}
                                    onPress={() => {
                                        if (showOptions) setShowOptions(undefined)
                                        deleteEntry(index)
                                    }}
                                />
                                <View
                                    style={{
                                        borderColor: color.neutral._400,
                                        borderLeftWidth: 1,
                                        marginLeft: 12,
                                        marginRight: 4,
                                    }}
                                />
                            </Animated.View>
                        )}

                        <Animated.View
                            entering={ZoomIn.duration(200)}
                            exiting={ZoomOut.duration(200)}>
                            <ThemedButton
                                accessibilityLabel="Fork message"
                                variant="tertiary"
                                iconName="fork"
                                iconSize={22}
                                iconStyle={{
                                    color: color.text._500,
                                }}
                                onPress={handleFork}
                            />
                        </Animated.View>

                        <Animated.View
                            entering={ZoomIn.duration(200)}
                            exiting={ZoomOut.duration(200)}>
                            <ThemedButton
                                accessibilityLabel="Copy message"
                                variant="tertiary"
                                iconName="copy"
                                iconSize={22}
                                iconStyle={{
                                    color: color.text._500,
                                }}
                                onPress={() => {
                                    if (showOptions) setShowOptions(undefined)
                                    setStringAsync(swipe.swipe)
                                        .then(() => {
                                            Logger.infoToast('Copied')
                                        })
                                        .catch(() => {
                                            Logger.errorToast('Failed to copy to clipboard')
                                        })
                                }}
                            />
                        </Animated.View>

                        <Animated.View
                            entering={ZoomIn.duration(200)}
                            exiting={ZoomOut.duration(200)}>
                            <ThemedButton
                                accessibilityLabel="Edit message"
                                variant="tertiary"
                                iconName="edit"
                                iconSize={24}
                                iconStyle={{
                                    color: color.text._500,
                                }}
                                onPress={handleEnableEdit}
                            />
                        </Animated.View>
                    </>
                )}
                <ChatTTS index={index} />
            </Animated.View>
        </View>
    )
}

export default ChatQuickActions
