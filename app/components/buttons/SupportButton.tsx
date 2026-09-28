import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Linking } from 'react-native'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'

import ThemedButton from './ThemedButton'

const SupportButton = () => {
    const tokens = useAstryxTokens()

    return (
        <ThemedButton
            onPress={() => {
                Linking.openURL('https://ko-fi.com/vali98')
            }}
            variant="secondary"
            label="Support ChatterUI"
            accessibilityHint="Open the ChatterUI support page"
            icon={<FontAwesome name="coffee" size={16} color={tokens.text.primary} />}
        />
    )
}

export default SupportButton
