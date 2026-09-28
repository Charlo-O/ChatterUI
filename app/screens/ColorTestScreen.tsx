import React from 'react'
import { ScrollView, Text, View } from 'react-native'

import { AstryxScreen } from '@components/astryx/AstryxShell'
import { Theme } from '@lib/theme/ThemeManager'

const ColorTestScreen = () => {
    const { color, spacing } = Theme.useTheme()

    return (
        <AstryxScreen title="Color Test" subtitle="Theme token preview">
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl2 }}>
            <View style={{ padding: spacing.xl2, backgroundColor: color.neutral._200 }}>
                <Text style={{ color: color.text._100 }}>ColorTest</Text>
            </View>
            {Object.keys(color).map((item) => {
                if (item === 'name') return
                return (
                    <View key={item}>
                        <Text style={{ color: color.text._100 }}>{item}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                //@ts-ignore
                                Object.keys(color?.[item] ?? {}).map((item2, index) => {
                                    return (
                                        <View
                                            key={item2}
                                            style={{
                                                flex: 1,
                                                paddingVertical: 24,
                                                //@ts-ignore
                                                backgroundColor: color?.[item]?.[item2],
                                            }}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                )
            })}
        </ScrollView>
        </AstryxScreen>
    )
}

export default ColorTestScreen
