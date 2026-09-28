import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import {
    AstryxButton,
    AstryxEmptyState,
    AstryxIconButton,
    useAstryxTokens,
} from '@components/astryx/AstryxPrimitives'
import { AstryxScreen } from '@components/astryx/AstryxShell'
import { APIManager } from '@lib/engine/API/APIManagerState'

import ConnectionItem from './ConnectionItem'

const ConnectionsManagerScreen = () => {
    // eslint-disable-next-line react-compiler/react-compiler
    'use no memo'
    const { apiValues } = APIManager.useConnectionsStore(
        useShallow((state) => ({
            apiValues: state.values,
        }))
    )
    const tokens = useAstryxTokens()

    const router = useRouter()
    return (
        <AstryxScreen
            title="API Manager"
            subtitle="Hosted model connections"
            showMenu={false}
            actions={
                <AstryxIconButton
                    iconName="file"
                    label="Open templates"
                    onPress={() => router.push('/screens/ConnectionsManagerScreen/TemplateManager')}
                />
            }>
            <SafeAreaView
                edges={['bottom']}
                style={{
                    paddingBottom: tokens.spacing.xxl,
                    flex: 1,
                    width: '100%',
                    maxWidth: 1040,
                    alignSelf: 'center',
                }}>
                {apiValues.length > 0 && (
                    <FlatList
                        style={{ paddingHorizontal: tokens.spacing.xl }}
                        contentContainerStyle={{ rowGap: 4, paddingBottom: tokens.spacing.xl }}
                        data={apiValues}
                        keyExtractor={(item, index) => item.configName + index}
                        renderItem={({ item, index }) => (
                            <ConnectionItem item={item} index={index} />
                        )}
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {apiValues.length === 0 && (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <AstryxEmptyState
                            icon="cloud-off"
                            title="No connections added"
                            description="Add an API connection to make hosted models available."
                            actionLabel="Add connection"
                            onAction={() =>
                                router.push('/screens/ConnectionsManagerScreen/AddConnection')
                            }
                        />
                    </View>
                )}

                {apiValues.length > 0 && (
                    <AstryxButton
                        style={{ marginHorizontal: tokens.spacing.xl }}
                        onPress={() =>
                            router.push('/screens/ConnectionsManagerScreen/AddConnection')
                        }
                        label="Add connection"
                        variant="primary"
                    />
                )}
            </SafeAreaView>
        </AstryxScreen>
    )
}

export default ConnectionsManagerScreen
