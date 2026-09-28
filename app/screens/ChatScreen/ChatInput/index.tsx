import { MaterialIcons } from '@expo/vector-icons'
import { randomUUID } from 'expo-crypto'
import { getDocumentAsync } from 'expo-document-picker'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { Platform, TextInput, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import { AstryxButton, useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import ThemedButton from '@components/buttons/ThemedButton'
import GlassSurface from '@components/liquid/GlassSurface'
import CameraSheet from '@components/views/CameraSheet'
import ContextMenu from '@components/views/ContextMenu'
import { AppSettings } from '@lib/constants/GlobalValues'
import { generateResponse } from '@lib/engine/Inference'
import { useUnfocusTextInput } from '@lib/hooks/UnfocusTextInput'
import { Characters } from '@lib/state/Characters'
import { Chats, useInference } from '@lib/state/Chat'
import { useChatInputTextStore } from '@lib/state/components/ChatInput'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'

import ChatOptions from './ChatInputOptions'

export type Attachment = {
    uri: string
    type: 'image' | 'audio' | 'document'
    name: string
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type ChatInputHeightStoreProps = {
    height: number
    setHeight: (n: number) => void
}

export const useInputHeightStore = create<ChatInputHeightStoreProps>()((set) => ({
    height: 112,
    setHeight: (n) => set({ height: Math.ceil(n) }),
}))

const ChatInput = () => {
    const inputRef = useUnfocusTextInput()

    const { color, spacing, glass } = Theme.useTheme()
    const tokens = useAstryxTokens()
    const errorFill = tokens.dark ? 'rgba(255, 152, 144, 0.24)' : '#FFC4BE'
    const errorOnFill = tokens.dark ? '#FFC4BE' : '#76000C'
    const [sendOnEnter] = useMMKVBoolean(AppSettings.SendOnEnter)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [showCamera, setShowCamera] = useState(false)
    const [textHeight, setTextHeight] = useState(36)
    const { addEntry } = Chats.useEntry()
    const { nowGenerating, abortFunction } = useInference(
        useShallow((state) => ({
            nowGenerating: state.nowGenerating,
            abortFunction: state.abortFunction,
        }))
    )
    const setHeight = useInputHeightStore(useShallow((state) => state.setHeight))

    const { charName } = Characters.useCharacterStore(
        useShallow((state) => ({
            charName: state?.card?.name,
        }))
    )

    const { userName } = Characters.useUserStore(
        useShallow((state) => ({ userName: state.card?.name }))
    )

    const { newMessage, setNewMessage } = useChatInputTextStore(
        useShallow((state) => ({
            newMessage: state.text,
            setNewMessage: state.setText,
        }))
    )

    const abortResponse = async () => {
        Logger.info(`Aborting Generation`)
        if (abortFunction) await abortFunction()
    }

    useEffect(() => {
        if (!newMessage) setTextHeight(36)
    }, [newMessage])

    const handleSend = async () => {
        if (newMessage.trim() !== '' || attachments.length > 0)
            await addEntry(
                userName ?? '',
                true,
                newMessage,
                attachments.map((item) => item.uri)
            )
        const swipeId = await addEntry(charName ?? '', false, '')
        setNewMessage('')
        setAttachments([])
        if (swipeId) generateResponse(swipeId)
    }

    const handlePickImage = async () => {
        const result = await getDocumentAsync({
            type: 'image/*',
            multiple: true,
            copyToCacheDirectory: true,
        })
        if (result.canceled || result.assets.length < 1) return

        const newAttachments = result.assets
            .map((item) => ({
                uri: item.uri,
                type: 'image',
                name: item.name,
            }))
            .filter((item) => !attachments.some((a) => a.name === item.name)) as Attachment[]
        setAttachments([...attachments, ...newAttachments])
    }

    return (
        <View
            onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height)
            }}
            style={{
                position: 'absolute',
                left: 16,
                right: 16,
                bottom: 8,
                borderRadius: 28,
                boxShadow: '0 10px 32px ' + glass.shadow + (glass.dark ? '60' : '26'),
            }}>
            <GlassSurface style={{ borderRadius: 28, padding: 12, rowGap: 8 }}>
                <Animated.FlatList
                    itemLayoutAnimation={LinearTransition}
                    style={{
                        display: attachments.length > 0 ? 'flex' : 'none',
                        padding: spacing.l,
                        backgroundColor: tokens.background.muted,
                        borderRadius: tokens.radius.container,
                    }}
                    horizontal
                    contentContainerStyle={{ columnGap: spacing.xl }}
                    data={attachments}
                    keyExtractor={(item) => item.uri}
                    renderItem={({ item }) => {
                        return (
                            <Animated.View
                                entering={FadeIn.duration(180)}
                                exiting={FadeOut.duration(120)}
                                style={{ alignItems: 'center', rowGap: 8 }}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{
                                        width: 128,
                                        height: undefined,
                                        aspectRatio: 1,
                                        borderRadius: tokens.radius.element,
                                        borderWidth: 1,
                                        borderColor: tokens.border.default,
                                    }}
                                />

                                <ThemedButton
                                    accessibilityLabel="Remove attachment"
                                    iconName="close"
                                    iconSize={20}
                                    buttonStyle={{
                                        paddingHorizontal: 2,
                                        paddingVertical: 2,
                                        position: 'absolute',
                                        alignSelf: 'flex-end',
                                        margin: -8,
                                        backgroundColor: color.neutral._200,
                                        borderColor: color.neutral._400,
                                        borderWidth: 1,
                                    }}
                                    onPress={() => {
                                        setAttachments(
                                            attachments.filter((a) => a.uri !== item.uri)
                                        )
                                    }}
                                />
                            </Animated.View>
                        )
                    }}
                />
                <CameraSheet
                    onTakePicture={(picture) => {
                        setAttachments((attachments) => [
                            ...attachments,
                            {
                                name: randomUUID().toString(),
                                uri: picture.uri,
                                type: 'image',
                            },
                        ])
                    }}
                    visible={showCamera}
                    setVisible={setShowCamera}
                />
                <AnimatedTextInput
                    ref={inputRef}
                    accessibilityLabel="Message"
                    testID="chat-message-input"
                    style={{
                        color: glass.label,
                        backgroundColor: 'transparent',
                        minHeight: 36,
                        maxHeight: 144,
                        height: textHeight,
                        borderWidth: 0,
                        paddingHorizontal: 8,
                        paddingTop: 4,
                        paddingBottom: 6,
                        fontSize: 17,
                        lineHeight: 23,
                        textAlignVertical: 'top',
                    }}
                    placeholder="Message"
                    placeholderTextColor={glass.muted}
                    selectionColor={glass.accent}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    onContentSizeChange={(event) => {
                        setTextHeight(
                            Math.max(36, Math.min(144, event.nativeEvent.contentSize.height))
                        )
                    }}
                    onChange={(event) => {
                        // The browser's scrollHeight cannot shrink while the textarea
                        // has a fixed height. Measure its natural height before clamping.
                        if (Platform.OS !== 'web') return
                        const target = event.target as unknown as HTMLTextAreaElement
                        target.style.height = 'auto'
                        const height = Math.max(36, Math.min(144, target.scrollHeight))
                        target.style.height = `${height}px`
                        setTextHeight(height)
                    }}
                    multiline
                    numberOfLines={1}
                    onKeyPress={(event) => {
                        // RN Web does not implement submitBehavior yet. Keep Shift+Enter
                        // and IME confirmation as input, matching the native setting.
                        if (Platform.OS !== 'web' || !sendOnEnter) return
                        const key = event.nativeEvent as typeof event.nativeEvent & {
                            shiftKey?: boolean
                            isComposing?: boolean
                            keyCode?: number
                        }
                        if (
                            key.key === 'Enter' &&
                            !key.shiftKey &&
                            !key.isComposing &&
                            key.keyCode !== 229
                        ) {
                            event.preventDefault()
                            if (!nowGenerating) void handleSend()
                        }
                    }}
                    submitBehavior={sendOnEnter ? 'submit' : 'newline'}
                    onSubmitEditing={
                        sendOnEnter ? (nowGenerating ? undefined : handleSend) : undefined
                    }
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ContextMenu
                        triggerAccessibilityLabel="Attachment options"
                        triggerIcon="plus"
                        triggerIconSize={23}
                        buttons={[
                            {
                                label: 'Take Picture',
                                icon: 'camera',
                                onPress: (close) => {
                                    close()
                                    setShowCamera(true)
                                },
                            },
                            {
                                label: 'Add Image',
                                icon: 'picture',
                                onPress: (close) => {
                                    close()
                                    void handlePickImage()
                                },
                            },
                        ]}
                        triggerStyle={{
                            color: glass.label,
                            padding: 10,
                            width: 44,
                            height: 44,
                            textAlign: 'center',
                            backgroundColor: glass.chip,
                            borderRadius: 999,
                        }}
                        placement="top"
                    />
                    <ChatOptions />
                    <View style={{ flex: 1 }} />
                    <AstryxButton
                        accessibilityLabel={
                            nowGenerating
                                ? 'Stop generating'
                                : newMessage.trim() || attachments.length
                                  ? 'Send message'
                                  : 'Generate response'
                        }
                        testID="chat-send-button"
                        icon={
                            <MaterialIcons
                                name={nowGenerating ? 'stop' : 'arrow-upward'}
                                color={nowGenerating ? errorOnFill : glass.outgoingText}
                                size={22}
                            />
                        }
                        style={{
                            width: 44,
                            height: 44,
                            paddingHorizontal: 0,
                            borderRadius: 999,
                            backgroundColor: nowGenerating ? errorFill : glass.outgoing,
                        }}
                        onPress={nowGenerating ? abortResponse : handleSend}
                    />
                </View>
            </GlassSurface>
        </View>
    )
}

export default ChatInput
