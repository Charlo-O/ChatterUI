import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useRef } from 'react'
import { FlatList, StyleSheet, View, type ViewToken } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import Drawer from '@components/views/Drawer'
import HeaderTitle from '@components/views/HeaderTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useDebounce } from '@lib/hooks/Debounce'
import { useAppMode } from '@lib/state/AppMode'
import { useBackgroundStore } from '@lib/state/BackgroundImage'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'
import { AppDirectory } from '@lib/utils/File'

import { useInputHeightStore } from '../ChatInput'
import ChatFooter from './ChatFooter'
import ChatItem from './ChatItem'
import ChatModelName from './ChatModelName'

type ListItem = {
    index: number
    key: string
    isLastMessage: boolean
    isGreeting: boolean
}

// FlatList cells must keep their component identity while tokens stream in.
const AnimatedCell = (props: any) => (
    <Animated.View {...props} layout={LinearTransition.duration(180)} exiting={FadeOut.duration(150)} entering={FadeIn.duration(180)} />
)

const ChatWindow = () => {
    const { glass } = Theme.useTheme()
    const { chat } = Chats.useChat()
    const charId = Characters.useCharacterStore((state) => state.card?.id)
    const { appMode } = useAppMode()
    const [saveScroll] = useMMKVBoolean(AppSettings.SaveScrollPosition)
    const [showModelname] = useMMKVBoolean(AppSettings.ShowModelInChat)
    const [autoScroll] = useMMKVBoolean(AppSettings.AutoScroll)
    const chatInputHeight = useInputHeightStore(useShallow((state) => state.height))
    const { data: { background_image: backgroundImage } = {} } = useLiveQuery(
        Characters.db.query.backgroundImageQuery(charId ?? -1)
    )
    const { cause: scrollCause, index: scrollIndex } = chat?.autoScroll ?? {}
    const flatlistRef = useRef<FlatList | null>(null)
    const { showSettings, showChat } = Drawer.useDrawerStore(
        useShallow((state) => ({
            showSettings: state.values?.[Drawer.ID.SETTINGS],
            showChat: state.values?.[Drawer.ID.CHATLIST],
        }))
    )

    const updateScrollPosition = useDebounce((position: number, chatId: number) => {
        if (chatId) {
            Chats.db.mutate.updateScrollOffset(chatId, position)
        }
    }, 200)

    // RN Web rejects changing this callback after mount. Read the current chat
    // at event time so switching conversations also cannot persist a stale ID.
    const handleViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<ListItem>[] }) => {
        const index = viewableItems[0]?.index
        const chatId = Chats.useChatState.getState().data?.id
        if (index != null && chatId) {
            updateScrollPosition(Math.max(0, index - (viewableItems.length === 1 ? 1 : 0)), chatId)
        }
    }, [updateScrollPosition])

    const image = useBackgroundStore((state) => state.image)

    const list: ListItem[] = (chat?.messages ?? [])
        .map((item, index) => ({
            index: index,
            key: item.id.toString(),
            isGreeting: index === 0,
            isLastMessage: !!chat?.messages && index === chat?.messages.length - 1,
        }))
        .reverse()

    useEffect(() => {
        if (!scrollCause || !scrollIndex) return
        const isSave = scrollCause === 'saveScroll'
        if (!saveScroll && isSave) return
        const offset = Math.max(0, scrollIndex + (isSave ? 1 : 0))

        if (offset > 2)
            flatlistRef.current?.scrollToIndex({
                index: offset,
                animated: scrollCause === 'search',
                viewOffset: 32,
            })
    }, [scrollCause, scrollIndex, saveScroll])

    const renderItems = ({ item }: { item: ListItem }) => {
        return (
            <ChatItem
                index={item.index}
                isLastMessage={item.isLastMessage}
                isGreeting={item.isGreeting}
            />
        )
    }

    const backgroundUri = backgroundImage
        ? Characters.getImageDir(backgroundImage)
        : image
          ? AppDirectory.Assets + image
          : undefined

    return (
        <ImageBackground
            cachePolicy="none"
            style={{
                flex: 1,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                overflow: 'hidden',
            }}
            source={
                backgroundUri && !backgroundUri.startsWith('web://')
                    ? { uri: backgroundUri }
                    : undefined
            }>
            {!backgroundUri && (
                <LinearGradient
                    pointerEvents="none"
                    colors={[glass.surface, glass.panelEnd]}
                    style={StyleSheet.absoluteFill}
                />
            )}
            <View
                pointerEvents="none"
                style={{
                    zIndex: 1,
                    alignSelf: 'center',
                    width: 40,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: glass.grabber,
                    marginTop: 10,
                    marginBottom: 6,
                }}
            />
            {showModelname && appMode === 'local' && (
                <HeaderTitle
                    headerShown={false}
                    headerTitle={() => !showSettings && !showChat && <ChatModelName />}
                />
            )}

            <FlatList
                CellRendererComponent={AnimatedCell}
                ref={flatlistRef}
                maintainVisibleContentPosition={
                    autoScroll ? null : { minIndexForVisible: 1, autoscrollToTopThreshold: 50 }
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                showsVerticalScrollIndicator={false}
                inverted
                data={list}
                keyExtractor={(item) => item.key}
                renderItem={renderItems}
                scrollEventThrottle={16}
                onViewableItemsChanged={handleViewableItemsChanged}
                onScrollToIndexFailed={(error) => {
                    flatlistRef.current?.scrollToOffset({
                        offset: error.averageItemLength * error.index,
                        animated: true,
                    })
                    setTimeout(() => {
                        if (list.length !== 0 && flatlistRef.current !== null) {
                            flatlistRef.current?.scrollToIndex({
                                index: error.index,
                                animated: true,
                                viewOffset: 32,
                            })
                        }
                    }, 100)
                }}
                contentContainerStyle={{
                    paddingTop: chatInputHeight + 24,
                    paddingBottom: 16,
                    rowGap: 8,
                }}
                ListFooterComponent={() => <ChatFooter />}
            />
        </ImageBackground>
    )
}

export default ChatWindow
