import { StyleSheet, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { useShallow } from 'zustand/react/shallow'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import GlassPortrait from '@components/liquid/GlassPortrait'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Characters, CharInfo } from '@lib/state/Characters'
import { CharacterSorter } from '@lib/state/CharacterSorter'
import { getFriendlyTimeStamp } from '@lib/utils/Time'

import CharacterEditPopup from './CharacterEditPopup'
import CharacterListingTags from './CharacterListingTags'

type CharacterListingProps = {
    character: CharInfo
    nowLoading: boolean
    setNowLoading: (b: boolean) => void
}

const CharacterListing: React.FC<CharacterListingProps> = ({
    character,
    nowLoading,
    setNowLoading,
}) => {
    const [showTags] = useMMKVBoolean(AppSettings.ShowTags)
    const { setShowSearch, setTagFilter, tagFilter } = CharacterSorter.useSorterStore(
        useShallow((state) => ({
            setShowSearch: state.setShowSearch,
            setTagFilter: state.setTagFilter,
            tagFilter: state.tagFilter,
        }))
    )
    const styles = useStyles()

    const getPreviewText = () => {
        if (character.latestSwipe === undefined || !character.latestName) return 'No Messages'
        return character.latestName + ':  ' + character.latestSwipe.trim()
    }

    return (
        <View>
            <CharacterEditPopup
                character={character}
                setNowLoading={setNowLoading}
                nowLoading={nowLoading}>
                <View style={styles.longButtonContainer}>
                    <GlassPortrait image={Characters.getImageDir(character.image_id)} size={60} />

                    <View style={{ flex: 1, paddingLeft: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                }}>
                                <Text style={styles.nametag} numberOfLines={1}>
                                    {character.name}
                                </Text>
                            </View>
                            <Text style={styles.timestamp}>
                                {getFriendlyTimeStamp(character.last_modified)}
                            </Text>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.previewText}>
                            {getPreviewText()}
                        </Text>
                    </View>
                </View>
            </CharacterEditPopup>
            <CharacterListingTags
                tags={character.tags}
                showTags={showTags!}
                onPress={(tag: string) => {
                    setShowSearch(true)
                    if (tagFilter.includes(tag)) return
                    setTagFilter([...tagFilter, tag])
                }}
            />
        </View>
    )
}

export default CharacterListing

const useStyles = () => {
    const tokens = useAstryxTokens()

    return StyleSheet.create({
        longButtonContainer: {
            flexDirection: 'row',
            backgroundColor: 'transparent',
            borderColor: tokens.border.default,
            borderWidth: 0,
            borderRadius: tokens.radius.container,
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 4,
            alignItems: 'center',
        },

        avatar: {
            width: 48,
            height: 48,
            borderRadius: tokens.radius.element,
            backgroundColor: tokens.background.muted,
            borderColor: tokens.border.default,
            borderWidth: 1,
        },

        nametag: {
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            color: tokens.text.primary,
        },

        timestamp: {
            fontSize: 13,
            marginLeft: 8,
            color: tokens.text.muted,
        },

        previewText: {
            marginTop: 4,
            fontSize: 15,
            lineHeight: 20,
            color: tokens.text.secondary,
        },
    })
}
