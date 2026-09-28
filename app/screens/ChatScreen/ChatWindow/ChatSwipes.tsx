import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { continueResponse, generateResponse, regenerateResponse } from '@lib/engine/Inference'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'

type SwipesProps = {
    nowGenerating: boolean
    isGreeting: boolean
    index: number
}

const ChatSwipes: React.FC<SwipesProps> = ({ nowGenerating, isGreeting, index }) => {
    const styles = useStyles()
    const { color } = Theme.useTheme()

    const { swipeChat, addSwipe } = Chats.useSwipes()
    const { swipeText, swipeId, swipeIndex, swipesLength } = Chats.useSwipeData(index)

    const handleSwipeLeft = () => {
        swipeChat(index, -1)
    }

    const handleSwipeRight = async (message: string) => {
        const atLimit = await swipeChat(index, 1)
        if (atLimit && !isGreeting) {
            const id = await addSwipe(index, message)
            if (!id) return
            if (message) continueResponse(id)
            else generateResponse(id)
        }
    }

    const isLastAltGreeting = isGreeting && swipeIndex === swipesLength - 1

    return (
        <View style={styles.swipesItem}>
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Previous response"
                style={styles.swipeButton}
                onPress={handleSwipeLeft}
                disabled={nowGenerating || swipeIndex === 0}>
                <AntDesign
                    name="left"
                    size={20}
                    color={swipeIndex === 0 || nowGenerating ? color.text._600 : color.text._300}
                />
            </TouchableOpacity>

            {index !== 0 && (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Regenerate response"
                    onPress={() => swipeId && regenerateResponse(swipeId)}
                    onLongPress={() => swipeId && regenerateResponse(swipeId, false)}
                    disabled={nowGenerating}
                    style={styles.swipeButton}>
                    <AntDesign
                        name="retweet"
                        size={20}
                        color={nowGenerating ? color.text._600 : color.text._300}
                    />
                </TouchableOpacity>
            )}

            <Text style={styles.swipeText}>
                {swipeIndex + 1} / {swipesLength}
            </Text>

            {index !== 0 && (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Continue response"
                    onPress={() => swipeId && continueResponse(swipeId)}
                    disabled={nowGenerating}
                    style={styles.swipeButton}>
                    <AntDesign
                        name="forward"
                        size={20}
                        color={nowGenerating ? color.text._600 : color.text._300}
                    />
                </TouchableOpacity>
            )}

            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Next response"
                style={styles.swipeButton}
                onPress={() => handleSwipeRight('')}
                onLongPress={() => handleSwipeRight(swipeText ?? '')}
                disabled={nowGenerating || isLastAltGreeting}>
                <AntDesign
                    name="right"
                    size={20}
                    color={isLastAltGreeting || nowGenerating ? color.text._400 : color.text._300}
                />
            </TouchableOpacity>
        </View>
    )
}

export default ChatSwipes

const useStyles = () => {
    const { color, spacing, glass } = Theme.useTheme()
    return StyleSheet.create({
        swipesItem: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            flex: 1,
            marginTop: spacing.s,
            paddingHorizontal: spacing.sm,
            borderRadius: 24,
            backgroundColor: glass.chip,
            zIndex: 32,
        },

        swipeText: {
            color: color.text._400,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.m,
        },

        swipeButton: {
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
            minWidth: 36,
            flex: 1,
            paddingVertical: spacing.sm,
        },
    })
}
