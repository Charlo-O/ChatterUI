import { count, eq, notInArray } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { BackHandler, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { AstryxIconButton } from '@components/astryx/AstryxPrimitives'
import StringArrayEditor from '@components/input/StringArrayEditor'
import ThemedTextInput from '@components/input/ThemedTextInput'
import TText from '@components/text/TText'
import { db } from '@db'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useI18n } from '@lib/i18n'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { Logger } from '@lib/state/Logger'
import { TagHider } from '@lib/state/TagHider'
import { Theme } from '@lib/theme/ThemeManager'
import { characterTags, tags } from 'db/schema'

import SortButton from './SortButton'

type CharacterListHeaderProps = {
    resultLength: number
}

const CharacterListHeader: React.FC<CharacterListHeaderProps> = ({ resultLength }) => {
    const [useTagHider, setUseTagHider] = useMMKVBoolean(AppSettings.UseTagHider)
    const { showSearch, setShowSearch, textFilter, setTextFilter, tagFilter, setTagFilter } =
        CharacterSorter.useSorterStore(
            useShallow((state) => ({
                showSearch: state.showSearch,
                setShowSearch: state.setShowSearch,
                textFilter: state.textFilter,
                setTextFilter: state.setTextFilter,
                tagFilter: state.tagFilter,
                setTagFilter: state.setTagFilter,
            }))
        )

    const { color } = Theme.useTheme()
    const { t } = useI18n()
    const [showTags, setShowTags] = useMMKVBoolean(AppSettings.ShowTags)
    const hiddenTags = TagHider.useHiddenTags()

    const { data } = useLiveQuery(
        db
            .select({
                tag: tags.tag,
                tagCount: count(characterTags.tag_id),
            })
            .from(tags)
            .leftJoin(characterTags, eq(characterTags.tag_id, tags.id))
            .groupBy(tags.tag)
            .where(notInArray(tags.tag, hiddenTags)),
        [hiddenTags]
    )

    useFocusEffect(
        useCallback(() => {
            if (!showSearch) return
            const handler = BackHandler.addEventListener('hardwareBackPress', () => {
                setTextFilter('')
                setShowSearch(false)
                return true
            })
            return () => handler.remove()
        }, [setShowSearch, setTextFilter, showSearch])
    )

    if (resultLength === 0 && !showSearch) return

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 12,
                }}>
                <View
                    style={{
                        columnGap: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <TText
                        style={{
                            color: color.text._400,
                            fontSize: 12,
                            fontWeight: '500',
                        }}>
                        Sort By
                    </TText>
                    <SortButton type="modified" label="Recent" />
                    <SortButton type="name" label="Name" />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                    columnGap: 2,
                    }}>
                    <AstryxIconButton
                        iconName="tag"
                        label={showTags ? 'Hide tags' : 'Show tags'}
                        variant="ghost"
                        onPress={() => {
                            setShowTags(!showTags)
                            if (showTags && tagFilter.length > 0) {
                                setTagFilter([])
                            }
                        }}
                    />
                    <AstryxIconButton
                        label={showSearch ? 'Close search' : 'Search characters'}
                        variant="ghost"
                        iconName={showSearch ? 'close' : 'search'}
                        onPress={() => {
                            setShowSearch(!showSearch)
                        }}
                        delayLongPress={5000}
                        onLongPress={() => {
                            setUseTagHider(!useTagHider)
                            Logger.infoToast('Hider ' + (!useTagHider ? 'Enabled' : 'Disabled'))
                        }}
                    />
                </View>
            </View>

            <Animated.View layout={LinearTransition}>
                {showSearch && (
                    <Animated.View
                        entering={FadeIn.delay(100)}
                        exiting={FadeOut}
                        style={{ paddingHorizontal: 12, paddingBottom: 8, rowGap: 8 }}>
                        {showTags && data.length > 0 && (
                            <StringArrayEditor
                                containerStyle={{ flex: 0 }}
                                suggestions={data
                                    .sort((a, b) => b.tagCount - a.tagCount)
                                    .map((item) => item.tag)}
                                label="Search By Tags"
                                value={tagFilter}
                                setValue={setTagFilter}
                                placeholder="Filter Tags..."
                                filterOnly
                                showSuggestionsOnEmpty
                            />
                        )}
                        <ThemedTextInput
                            label="Search By Name"
                            containerStyle={{ flex: 0 }}
                            value={textFilter}
                            onChangeText={setTextFilter}
                            style={{
                                color: resultLength === 0 ? color.text._700 : color.text._100,
                            }}
                            placeholder="Name..."
                        />
                        {(textFilter || tagFilter.length > 0) && (
                            <TText
                                style={{
                                    marginTop: 8,
                                    color: color.text._400,
                                }}>
                                {t('Results: {{count}}', { count: resultLength })}
                            </TText>
                        )}
                    </Animated.View>
                )}
            </Animated.View>
        </>
    )
}

export default CharacterListHeader
