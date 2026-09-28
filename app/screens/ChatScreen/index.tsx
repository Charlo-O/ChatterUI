import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { AstryxIconButton } from '@components/astryx/AstryxPrimitives'
import GlassPortrait from '@components/liquid/GlassPortrait'
import GlassSurface from '@components/liquid/GlassSurface'
import AvatarViewer from '@components/views/AvatarViewer'
import ContextMenu from '@components/views/ContextMenu'
import Drawer from '@components/views/Drawer'
import HeaderTitle from '@components/views/HeaderTitle'
import SettingsDrawer from '@components/views/SettingsDrawer'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { useAvatarViewerStore } from '@lib/state/components/AvatarViewer'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { ChatImportSchema } from '@lib/utils/ChatSchema'
import { pickStringDocument } from '@lib/utils/File'
import ChatInput from '@screens/ChatScreen/ChatInput'
import ChatsDrawer from '@screens/ChatScreen/ChatsDrawer'
import ChatWindow from '@screens/ChatScreen/ChatWindow'

import ChatEditor from './ChatWindow/ChatEditor'

const ChatScreen = () => {
    const router = useRouter()
    const { glass } = Theme.useTheme()
    const insets = useSafeAreaInsets()
    const { unloadCharacter, charId } = Characters.useCharacterStore(
        useShallow((state) => ({
            unloadCharacter: state.unloadCard,
            charId: state.id,
        }))
    )
    const userId = Characters.useUserStore(useShallow((state) => state.id))

    const { height } = useReanimatedKeyboardAnimation()
    const animatedStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: Math.max(0, -height.value - insets.bottom),
            flex: 1,
        }
    })

    const { chat, unloadChat, loadChat } = Chats.useChat()

    const setDrawer = Drawer.useDrawerStore((state) => state.setShow)
    const characterName = Characters.useCharacterStore((state) => state.card?.name)
    const characterImage = Characters.useCharacterStore((state) => state.card?.image_id)
    const setShowAvatar = useAvatarViewerStore((state) => state.setShow)

    useEffect(() => {
        return () => {
            unloadCharacter()
            unloadChat()
        }
    }, [unloadCharacter, unloadChat])

    const handleCreateChat = async () => {
        if (charId)
            Chats.db.mutate.createChat(charId).then((chatId) => {
                if (chatId) loadChat(chatId)
            })
    }

    const handleImportChat = async () => {
        if (!charId || !userId) {
            Logger.errorToast('You are somehow importing a chat without a character or user')
            return
        }
        const file = await pickStringDocument({ type: 'application/json' })
        if (!file.success) return
        const result = ChatImportSchema.safeParse(JSON.parse(file.data))
        if (!result.success) {
            Logger.errorToast('Failed to Import')
            Logger.error('Incorrect format')
            return
        }
        const chat = result.data
        chat.character_id = charId
        chat.scroll_offset = 0
        delete chat.id
        chat.messages = chat.messages.map((message) => {
            delete message.id
            message.swipes = message.swipes.map((swipe) => {
                delete swipe.id
                return swipe
            })
            message.attachments = []
            return message
        })

        if (chat.user_id) {
            const userExists = await Characters.db.query.card(chat.user_id)
            if (!userExists) {
                chat.user_id = null
            }
        }

        chat.last_modified = Date.now()
        Chats.db.mutate.cloneChat(chat)
    }

    return (
        <Drawer.Gesture
            config={[
                {
                    drawerID: Drawer.ID.CHATLIST,
                    openDirection: 'left',
                    closeDirection: 'right',
                },
                {
                    drawerID: Drawer.ID.SETTINGS,
                    openDirection: 'right',
                    closeDirection: 'left',
                },
            ]}>
            <View
                style={{
                    flex: 1,
                    paddingBottom: insets.bottom,
                    backgroundColor: glass.background,
                }}>
                <Animated.View style={animatedStyle}>
                    <HeaderTitle headerShown={false} />
                    <View
                        style={{
                            paddingTop: Platform.OS === 'web' ? 16 : insets.top + 8,
                            paddingBottom: 8,
                            paddingHorizontal: 16,
                            width: '100%',
                            maxWidth: 900,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <GlassSurface interactive style={{ borderRadius: 999 }}>
                            <AstryxIconButton
                                iconName="left"
                                iconSize={23}
                                label="Go back"
                                variant="ghost"
                                onPress={() =>
                                    router.canGoBack() ? router.back() : router.replace('/')
                                }
                            />
                        </GlassSurface>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="View character avatar"
                            onPress={() => setShowAvatar(true, false)}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                alignItems: 'center',
                                gap: 4,
                                paddingHorizontal: 16,
                            }}>
                            <GlassPortrait
                                image={Characters.getImageDir(characterImage ?? 0)}
                                size={46}
                            />
                            <Text
                                numberOfLines={1}
                                style={{ color: glass.secondary, fontSize: 13, fontWeight: '500' }}>
                                {characterName ?? 'Chat'}
                            </Text>
                        </Pressable>
                        <GlassSurface interactive style={{ borderRadius: 999 }}>
                            <ContextMenu
                                triggerAccessibilityLabel="Conversation menu"
                                trigger={
                                    <AstryxIconButton
                                        iconName="ellipsis"
                                        iconSize={24}
                                        label="Conversation menu"
                                        variant="ghost"
                                    />
                                }
                                buttons={[
                                    {
                                        label: 'Chat History',
                                        icon: 'message',
                                        onPress: (close) => {
                                            close()
                                            setDrawer(Drawer.ID.CHATLIST, true)
                                        },
                                    },
                                    {
                                        label: 'New chat',
                                        icon: 'plus',
                                        onPress: (close) => {
                                            close()
                                            void handleCreateChat()
                                        },
                                    },
                                    {
                                        label: 'Import chat',
                                        icon: 'upload',
                                        onPress: (close) => {
                                            close()
                                            void handleImportChat()
                                        },
                                    },
                                    {
                                        label: 'Edit Character',
                                        icon: 'edit',
                                        onPress: (close) => {
                                            close()
                                            router.push('/screens/CharacterEditorScreen')
                                        },
                                    },
                                    {
                                        label: 'Settings',
                                        icon: 'setting',
                                        onPress: (close) => {
                                            close()
                                            setDrawer(Drawer.ID.SETTINGS, true)
                                        },
                                    },
                                ]}
                            />
                        </GlassSurface>
                    </View>
                    <View style={{ flex: 1, width: '100%', maxWidth: 900, alignSelf: 'center' }}>
                        {chat && <ChatWindow />}
                        <ChatInput />
                        <AvatarViewer />
                        <ChatEditor />
                    </View>
                </Animated.View>

                {/**Drawer has to be outside of the KeyboardAvoidingView */}
                <SettingsDrawer />
                <ChatsDrawer />
            </View>
        </Drawer.Gesture>
    )
}

export default ChatScreen
