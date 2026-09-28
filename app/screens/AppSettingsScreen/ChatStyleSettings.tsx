import React from 'react'
import { View } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import HorizontalSelector from '@components/input/HorizontalSelector'
import { AstryxCard } from '@components/astryx/AstryxPrimitives'
import { AstryxScreen } from '@components/astryx/AstryxShell'
import { MarkdownStyle } from '@lib/markdown/Markdown'
import { ChatStyle } from '@lib/state/ChatStyle'
import { Theme } from '@lib/theme/ThemeManager'

const renderedText = `
This is some test text
| Row One  | Row Two | Row Three   |
|----------|--------:|-------------|
| Item 1   |  row    | row         |
| Item 2   |  row    | row         |

$s = ut + \\frac{1}{2}at^2$ 

Distance from initial velocity, time and acceleration

A **strong** (bold) text example.

A *emphasized* (italic) text example.

A ~~strikethrough~~ text example.

"A quote text example."
`

const ChatStyling = () => {
    const { markdown, rules, style } = MarkdownStyle.useCustomFormatting()
    const { weight, size, setWeight, setSize } = ChatStyle.useChatStyle(
        useShallow((state) => ({
            weight: state.textWeight,
            size: state.fontSize,
            setWeight: state.setTextWeight,
            setSize: state.setFontSize,
        }))
    )
    const { color } = Theme.useTheme()
    return (
        <AstryxScreen title="Chat Styling" subtitle="Message appearance">
            <SafeAreaView style={{ flex: 1, rowGap: 4, padding: 16, paddingBottom: 32 }}>
                <AstryxCard
                    style={{
                        marginVertical: 16,
                        alignItems: 'center',
                        padding: 24,
                        justifyContent: 'center',
                        borderColor: color.neutral._200,
                    }}>
                    <Markdown mergeStyle={false} markdownit={markdown} rules={rules} style={style}>
                        {renderedText}
                    </Markdown>
                </AstryxCard>

            <HorizontalSelector
                values={ChatStyle.SIZES.map((item) => ({
                    value: item,
                    label: item.toUpperCase(),
                }))}
                label={'Font Size'}
                selected={size}
                onPress={(item) => setSize(item)}
                style={{ flex: 0 }}
            />
            <HorizontalSelector
                values={ChatStyle.WEIGHTS.map((item) => ({
                    value: item,
                    label: item,
                }))}
                label={'Font Weight'}
                selected={weight}
                onPress={(item) => setWeight(item)}
                style={{ flex: 0 }}
            />
            </SafeAreaView>
        </AstryxScreen>
    )
}

export default ChatStyling
