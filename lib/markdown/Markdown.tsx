import { setStringAsync } from 'expo-clipboard'
import { useCallback, useMemo } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { MarkdownIt } from 'react-native-markdown-display'
import MathJax from 'react-native-mathjax-svg'

import ThemedButton from '@components/buttons/ThemedButton'
import Accordion from '@components/views/Accordion'
import { ChatStyle } from '@lib/state/ChatStyle'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'

import latexPlugin from './MarkdownLatexPlugin'
import doubleQuotePlugin from './MarkdownQuotePlugin'
import thinkPlugin from './MarkdownThinkPlugin'

export namespace MarkdownStyle {
    export const Rules = MarkdownIt({ typographer: true })
        .use(thinkPlugin)
        .use(doubleQuotePlugin)
        .use(latexPlugin)

    export const RenderRules = {
        fence: (node: any, children: any, parent: any, styles: any, inheritedStyles = {}) => {
            let { content, sourceInfo } = node
            if (
                typeof node.content === 'string' &&
                node.content.charAt(node.content.length - 1) === '\n'
            ) {
                content = node.content.substring(0, node.content.length - 1)
            }
            return (
                <View key={node.key}>
                    <View style={styles.fenceHeader}>
                        <Text style={{ color: styles.fenceHeader.color }}>
                            {sourceInfo || 'Code'}
                        </Text>
                        {Boolean(content) && (
                            <ThemedButton
                                accessibilityLabel="Copy code"
                                iconName="copy"
                                variant="tertiary"
                                iconStyle={{ color: styles.fenceHeader.color }}
                                onPress={() => {
                                    setStringAsync(content)
                                        .then(() => {
                                            Logger.infoToast('Copied Code')
                                        })
                                        .catch(() => {
                                            Logger.errorToast('Failed to copy to clipboard')
                                        })
                                }}
                            />
                        )}
                    </View>
                    <Text style={[inheritedStyles, styles.fence]}>{content}</Text>
                </View>
            )
        },
        double_quote: (node: any, children: any, parent: any, styles: any) => {
            return (
                <Text key={node.key} style={styles.double_quote}>
                    “{children}”
                </Text>
            )
        },
        think: (node: any, children: any, parent: any, styles: any) => {
            return (
                <Accordion
                    key={node.key}
                    label={node.sourceInfo ? 'Thought Process' : 'Thinking...'}
                    style={{
                        flex: 1,
                        marginBottom: 8,
                        elevation: 8,
                    }}>
                    {children}
                </Accordion>
            )
        },
        latex_block: (node: any, children: any, parent: any, styles: any) => {
            const { content } = node
            return (
                <MathJax
                    key={node.key}
                    style={styles.latex_block}
                    color={styles.latex_block.color ?? 'white'}>
                    {content}
                </MathJax>
            )
        },
        latex_inline: (node: any, children: any, parent: any, styles: any) => {
            const { content } = node
            return (
                <MathJax
                    key={node.key}
                    style={styles.latex_inline}
                    color={styles.latex_inline.color ?? 'white'}>
                    {content}
                </MathJax>
            )
        },
    }

    export const useCustomFormatting = (inverted = false) => {
        const mdStyle = useMarkdownStyle(inverted)

        const { markdown, rules, style } = useMemo(
            () => ({
                markdown: Rules,
                rules: RenderRules,
                style: mdStyle,
            }),
            [mdStyle]
        )
        return { markdown, rules, style }
    }

    export const useMarkdownStyle = (inverted = false) => {
        const { color, spacing, borderRadius, glass } = Theme.useTheme()
        const { fontSize, textWeight } = ChatStyle.useChatStyle()
        const foreground = inverted ? glass.outgoingText : glass.label
        const foregroundMuted = inverted ? (glass.dark ? '#55555D' : '#D0D0D5') : glass.secondary
        const insetSurface = inverted ? (glass.dark ? '#E0E0E5' : '#2B2B30') : glass.inset

        const getModifiedFontSize = useCallback(
            (size: number) =>
                Math.max(ChatStyle.MIN_FONT_SIZE, ChatStyle.sizeModifierMap[fontSize] + size),
            [fontSize]
        )

        const getModifiedFontWeight = useCallback(
            (weight: number) => {
                const newWeight = Math.max(
                    200,
                    Math.min(900, weight + (ChatStyle.weightModifierMap?.[textWeight] ?? 0))
                )
                return `${newWeight}` as any
            },
            [textWeight]
        )

        return useMemo(
            () =>
                StyleSheet.create({
                    double_quote: { color: foregroundMuted },
                    // The main container
                    body: {
                        fontSize: getModifiedFontSize(17),
                        color: foreground,
                    },

                    // Headings
                    heading1: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(32),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },
                    heading2: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(24),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },
                    heading3: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(18),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },
                    heading4: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(16),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },
                    heading5: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(13),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },
                    heading6: {
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(11),
                        color: foreground,
                        fontWeight: getModifiedFontWeight(500),
                    },

                    // Horizontal Rule
                    hr: {
                        backgroundColor: foregroundMuted,
                        height: 1,
                        marginTop: spacing.m,
                    },

                    // Emphasis
                    strong: {
                        fontWeight: getModifiedFontWeight(700),
                        color: foreground,
                    },
                    em: {
                        fontStyle: 'italic',
                        color: foregroundMuted,
                    },
                    s: {
                        textDecorationLine: 'line-through',
                        color: foregroundMuted,
                    },

                    // Blockquotes
                    blockquote: {
                        backgroundColor: insetSurface,
                        borderColor: foregroundMuted,
                        borderWidth: 1,
                        borderRadius: borderRadius.m,
                        marginLeft: spacing.sm,
                        paddingHorizontal: spacing.sm,
                        color: foregroundMuted,
                    },

                    // Lists
                    bullet_list: {
                        marginVertical: spacing.sm,
                    },
                    ordered_list: {
                        marginVertical: spacing.sm,
                    },
                    list_item: {
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        color: foreground,
                    },
                    // @pseudo class, does not have a unique render rule
                    bullet_list_icon: {
                        color: foregroundMuted,
                        marginLeft: spacing.m,
                        marginRight: spacing.m,
                    },
                    // @pseudo class, does not have a unique render rule
                    bullet_list_content: {
                        flex: 1,
                    },
                    // @pseudo class, does not have a unique render rule
                    ordered_list_icon: {
                        color: foregroundMuted,
                        marginLeft: spacing.m,
                        marginRight: spacing.m,
                    },
                    // @pseudo class, does not have a unique render rule
                    ordered_list_content: {
                        flex: 1,
                    },

                    // Code
                    code_inline: {
                        backgroundColor: insetSurface,
                        paddingHorizontal: spacing.m,
                        flex: 1,
                        borderRadius: 4,
                        ...Platform.select({
                            ios: {
                                fontFamily: 'Courier',
                            },
                            android: {
                                fontFamily: 'monospace',
                            },
                        }),
                    },
                    code_block: {
                        color: foregroundMuted,
                        borderWidth: 1,
                        borderColor: color.neutral._100,
                        backgroundColor: insetSurface,
                        padding: 4,
                        borderRadius: 8,
                        ...Platform.select({
                            ios: {
                                fontFamily: 'Courier',
                            },
                            android: {
                                fontFamily: 'monospace',
                            },
                        }),
                    },
                    fence: {
                        color: foreground,
                        backgroundColor: insetSurface,
                        borderColor: foregroundMuted,
                        borderWidth: 1,
                        paddingLeft: spacing.l,
                        paddingRight: spacing.l,
                        paddingVertical: spacing.m,
                        marginBottom: spacing.m,
                        borderBottomLeftRadius: borderRadius.m,
                        borderBottomRightRadius: borderRadius.m,
                        ...Platform.select({
                            ios: {
                                fontFamily: 'Courier',
                            },
                            android: {
                                fontFamily: 'monospace',
                            },
                        }),
                    },

                    fenceHeader: {
                        color: foreground,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        backgroundColor: insetSurface,
                        borderTopLeftRadius: borderRadius.m,
                        borderTopRightRadius: borderRadius.m,
                        marginTop: spacing.sm,
                    },

                    // Tables
                    table: {
                        borderWidth: 2,
                        borderColor: color.neutral._300,
                        borderRadius: borderRadius.m,
                        marginBottom: spacing.m,
                        overflow: 'hidden',
                    },
                    thead: {
                        backgroundColor: color.neutral._300,
                    },
                    tbody: {
                        backgroundColor: insetSurface,
                    },
                    th: {
                        flex: 1,
                        padding: 8,
                    },
                    tr: {
                        borderBottomWidth: 1,
                        borderColor: color.neutral._300,
                        flexDirection: 'row',
                        fontSize: getModifiedFontSize(14),
                    },
                    td: {
                        flex: 1,
                        padding: 8,
                    },

                    // Links
                    link: {
                        textDecorationLine: 'underline',
                        color: foreground,
                    },
                    blocklink: {
                        flex: 1,
                        borderColor: foregroundMuted,
                        borderBottomWidth: 1,
                    },

                    // Images
                    image: {
                        flex: 1,
                    },

                    // Text Output
                    text: {},

                    textgroup: {
                        fontWeight: getModifiedFontWeight(400),
                        color: foreground,
                    },
                    latex_inline: {
                        color: foreground,
                    },
                    latex_block: {
                        color: foreground,
                        marginTop: spacing.l,
                        marginBottom: spacing.sm,
                    },
                    paragraph: {
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100%',
                        color: foreground,
                        marginVertical: 6,
                        fontSize: getModifiedFontSize(17),
                        lineHeight: getModifiedFontSize(23),
                    },

                    hardbreak: {
                        width: '100%',
                        height: 1,
                        color: foreground,
                    },
                    softbreak: {},

                    // Believe these are never used but retained for completeness
                    pre: {},
                    inline: {},
                    span: {},
                }),
            [
                color,
                spacing,
                borderRadius,
                foreground,
                foregroundMuted,
                insetSurface,
                getModifiedFontSize,
                getModifiedFontWeight,
            ]
        )
    }
}
