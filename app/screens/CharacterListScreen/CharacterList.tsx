import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { usePathname, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition, ReduceMotion } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { AstryxIconButton, useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import { AstryxPage, AstryxSideNav, AstryxTopBar } from '@components/astryx/AstryxShell'
import GlassPortrait from '@components/liquid/GlassPortrait'
import GlassSurface from '@components/liquid/GlassSurface'
import Drawer from '@components/views/Drawer'
import HeaderTitle from '@components/views/HeaderTitle'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { TagHider } from '@lib/state/TagHider'

import CharacterEditPopup from './CharacterEditPopup'
import CharacterListHeader from './CharacterListHeader'
import CharacterListing from './CharacterListing'
import CharacterNewMenu from './CharacterNewMenu'
import CharactersEmpty from './CharactersEmpty'
import CharactersSearchEmpty from './CharactersSearchEmpty'

const PAGE_SIZE = 30

const CharacterList: React.FC = () => {
    const router = useRouter()
    const tokens = useAstryxTokens()
    const [nowLoading, setNowLoading] = useState(false)
    const [showPortraits, setShowPortraits] = useState(false)
    const userImage = Characters.useUserStore((state) => state.card?.image_id)
    const setDrawer = Drawer.useDrawerStore((state) => state.setShow)
    const { searchType, searchOrder, tagFilter, textFilter } = CharacterSorter.useSorterStore(
        useShallow((state) => ({
            searchType: state.searchType,
            searchOrder: state.searchOrder,
            tagFilter: state.tagFilter,
            textFilter: state.textFilter,
        }))
    )
    const hiddenTags = TagHider.useHiddenTags()
    const [pages, setPages] = useState(3)
    const [previousLength, setPreviousLength] = useState(0)
    const { data, updatedAt } = useLiveQuery(
        Characters.db.query.cardListQueryWindow(
            'character',
            searchType,
            searchOrder,
            PAGE_SIZE * pages,
            0,
            textFilter,
            tagFilter,
            hiddenTags
        ),
        [searchType, searchOrder, textFilter, tagFilter, hiddenTags, pages]
    )

    const characterList: CharInfo[] = useMemo(() => {
        return data.map((item) => ({
            ...item,
            latestChat: item.chats[0]?.id,
            latestSwipe: item.chats[0]?.messages[0]?.swipes[0]?.swipe,
            latestName: item.chats[0]?.messages[0]?.name,
            last_modified: item.last_modified ?? 0,
            tags: item.tags.map((item) => item.tag.tag),
        }))
    }, [data])

    // do not render when not shown, optimizes some rerenders
    const path = usePathname()
    if (path !== '/') return

    return (
        <AstryxPage>
            <HeaderTitle headerShown={false} />
            <AstryxTopBar
                title="Chats"
                leading={
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Open navigation"
                        onPress={() => setDrawer(Drawer.ID.SETTINGS, true)}>
                        <GlassPortrait size={44} image={Characters.getImageDir(userImage ?? 0)} />
                    </Pressable>
                }
                titleAccessory={
                    characterList.length > 0 && (
                        <View style={{ flexDirection: 'row', paddingRight: 4 }}>
                            {characterList.slice(0, 3).map((character, index) => (
                                <GlassPortrait
                                    key={character.id}
                                    image={Characters.getImageDir(character.image_id)}
                                    size={26}
                                    style={{ marginLeft: index ? -10 : 0, zIndex: 3 - index }}
                                />
                            ))}
                        </View>
                    )
                }
                onTitlePress={
                    characterList.length ? () => setShowPortraits(!showPortraits) : undefined
                }
                actions={
                    <GlassSurface interactive style={{ borderRadius: 999 }}>
                        <CharacterNewMenu
                            nowLoading={nowLoading}
                            setNowLoading={setNowLoading}
                            trigger={
                                <AstryxIconButton
                                    label="New character"
                                    variant="ghost"
                                    iconName="plus"
                                    iconSize={25}
                                />
                            }
                        />
                    </GlassSurface>
                }
            />
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <AstryxSideNav
                    title="Workspace"
                    items={[
                        {
                            label: 'Characters',
                            icon: 'people-outline',
                            selected: true,
                            onPress: () => {},
                        },
                        {
                            label: 'Models',
                            icon: 'hub',
                            onPress: () => router.push('/screens/ModelManagerScreen'),
                        },
                        {
                            label: 'Connections',
                            icon: 'link',
                            onPress: () => router.push('/screens/ConnectionsManagerScreen'),
                        },
                        {
                            label: 'Settings',
                            icon: 'settings',
                            onPress: () => router.push('/screens/AppSettingsScreen'),
                        },
                    ]}
                />
                <View
                    style={{
                        flex: 1,
                        maxWidth: 900,
                        paddingHorizontal: 20,
                        width: '100%',
                        marginHorizontal: 'auto',
                    }}>
                    {showPortraits && (
                        <Animated.View
                            entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
                            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    gap: 20,
                                    paddingTop: 8,
                                    paddingBottom: 20,
                                }}>
                                {characterList.slice(0, 12).map((character) => (
                                    <CharacterEditPopup
                                        key={character.id}
                                        character={character}
                                        nowLoading={nowLoading}
                                        setNowLoading={setNowLoading}>
                                        <View style={{ alignItems: 'center', gap: 8, width: 68 }}>
                                            <GlassPortrait
                                                image={Characters.getImageDir(character.image_id)}
                                                size={60}
                                            />
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: 12,
                                                    color: tokens.text.secondary,
                                                }}>
                                                {character.name}
                                            </Text>
                                        </View>
                                    </CharacterEditPopup>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    )}
                    <CharacterListHeader resultLength={characterList.length} />
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            layout={LinearTransition}
                            itemLayoutAnimation={LinearTransition}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ rowGap: 4, paddingBottom: 32 }}
                            data={characterList}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <CharacterListing
                                    character={item}
                                    nowLoading={nowLoading}
                                    setNowLoading={setNowLoading}
                                />
                            )}
                            onEndReachedThreshold={1}
                            onEndReached={() => {
                                if (previousLength === data.length) return
                                setPreviousLength(data.length)
                                setPages(pages + 1)
                            }}
                            windowSize={3}
                            onStartReachedThreshold={0.1}
                            onStartReached={() => {
                                if (pages !== 3) setPages(3)
                            }}
                            ListEmptyComponent={() =>
                                data.length === 0 && updatedAt && <CharactersEmpty />
                            }
                        />
                    </View>

                    {characterList.length === 0 && data.length !== 0 && updatedAt && (
                        <CharactersSearchEmpty />
                    )}
                </View>
            </View>
        </AstryxPage>
    )
}

export default CharacterList
