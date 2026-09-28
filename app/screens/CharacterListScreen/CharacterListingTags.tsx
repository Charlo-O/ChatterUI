import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { Theme } from '@lib/theme/ThemeManager'

type CharacterListingTagsProps = {
    tags: string[]
    onPress: (tag: string) => void
    showTags: boolean
}

const CharacterListingTags: React.FC<CharacterListingTagsProps> = ({ tags, onPress, showTags }) => {
    const { color, spacing, borderRadius, fontSize } = Theme.useTheme()

    if (!showTags || tags.length === 0) return

    return (
        <View
            style={{
                flexDirection: 'row',

                paddingLeft: 72,
                paddingRight: 16,
                alignItems: 'center',
            }}>
            <View
                style={{
                    flex: 1,
                    columnGap: 4,
                    rowGap: 4,
                    flexDirection: 'row',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                }}>
                {tags.map((tag, index) => (
                    <Pressable
                        key={index}
                        accessibilityRole="button"
                        accessibilityLabel={`Filter by ${tag}`}
                        onPress={() => onPress(tag)}
                        style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
                        <Text
                            style={{
                                color: color.text._400,
                                fontSize: fontSize.s,
                                borderWidth: 1,
                                borderColor: color.neutral._400,
                                backgroundColor: color.neutral._300,
                                paddingHorizontal: spacing.m,
                                paddingVertical: spacing.s,
                                borderRadius: borderRadius.m,
                            }}>
                            {tag}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

export default CharacterListingTags
