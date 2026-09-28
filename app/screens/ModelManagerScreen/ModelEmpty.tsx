import { View } from 'react-native'

import { AstryxEmptyState } from '@components/astryx/AstryxPrimitives'

const ModelEmpty = () => {
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}>
            <AstryxEmptyState
                icon="inventory-2"
                title="No models found"
                description="Import a model or connect an external model to start chatting."
            />
        </View>
    )
}

export default ModelEmpty
