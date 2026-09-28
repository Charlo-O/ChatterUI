import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useState } from 'react'
import { SectionList } from 'react-native'
import Animated, { Easing, SlideInLeft, SlideOutLeft } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import { AstryxScreen } from '@components/astryx/AstryxShell'
import SectionTitle from '@components/text/SectionTitle'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Model } from '@lib/engine/Local/Model'

import ModelEmpty from './ModelEmpty'
import ModelInfoHeader from './ModelInfoHeader'
import ModelItem from './ModelItem'
import ModelNewMenu from './ModelNewMenu'
import ModelSettings from './ModelSettings'

const ModelManagerScreen = () => {
    const tokens = useAstryxTokens()

    const { data: mmprojLinks } = useLiveQuery(Model.getMMPROJLinks())

    const { data: modelList, updatedAt: modelUpdatedAt } = useLiveQuery(
        Model.getModelListQuery2(),
        [mmprojLinks]
    )
    const { data: mmprojList } = useLiveQuery(Model.getMMPROJListQuery())

    const [showSettings, setShowSettings] = useState(false)
    const [modelLoading, setModelLoading] = useState(false)
    const [modelImporting, setModelImporting] = useState(false)

    const { setloadProgress } = Llama.useLlamaModelStore(
        useShallow((state) => ({
            setloadProgress: state.setLoadProgress,
        }))
    )

    const data = [
        {
            title: 'Models',
            data: modelList,
        },
        {
            title: 'Multimodal Adapters',
            data: mmprojList,
        },
    ]

    return (
        <AstryxScreen
            title={showSettings ? 'Model Settings' : 'Models'}
            subtitle={showSettings ? 'Local model runtime' : 'Local and multimodal models'}
            actions={
                !showSettings ? (
                    <ModelNewMenu
                        modelImporting={modelImporting}
                        setModelImporting={setModelImporting}
                    />
                ) : undefined
            }
            onPrimary={() => setShowSettings((value) => !value)}
            primaryLabel={showSettings ? 'Back to models' : 'Settings'}
            primaryIcon={showSettings ? 'arrow-back' : 'settings'}>
            <SafeAreaView
                edges={['bottom']}
                style={{
                    paddingHorizontal: tokens.spacing.xl,
                    paddingBottom: tokens.spacing.xxl,
                    flex: 1,
                }}>
                {!showSettings && (
                    <Animated.View
                        style={{ flex: 1 }}
                        entering={SlideInLeft.easing(Easing.inOut(Easing.cubic))}
                        exiting={SlideOutLeft.easing(Easing.inOut(Easing.cubic))}>
                        <ModelInfoHeader
                            modelImporting={modelImporting}
                            modelLoading={modelLoading}
                            modelListLength={modelList.length}
                            modelUpdatedAt={modelUpdatedAt}
                        />

                        <SectionList
                            style={{
                                marginTop: tokens.spacing.lg,
                                flex: 1,
                            }}
                            sections={data}
                            renderItem={({ item }) => (
                                <ModelItem
                                    item={item}
                                    mmprojList={mmprojList}
                                    modelLoading={modelLoading}
                                    setModelLoading={(b: boolean) => {
                                        if (b) setloadProgress(0)
                                        setModelLoading(b)
                                    }}
                                    modelImporting={modelImporting}
                                />
                            )}
                            renderSectionHeader={({ section: { title, data } }) => {
                                if (mmprojList.length > 0)
                                    return (
                                        <SectionTitle
                                            visible={data.length > 0}
                                            style={{ marginBottom: tokens.spacing.lg }}>
                                            {title}
                                        </SectionTitle>
                                    )
                                return <></>
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            removeClippedSubviews={false}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => <ModelEmpty />}
                        />
                    </Animated.View>
                )}

                {showSettings && (
                    <ModelSettings
                        modelImporting={modelImporting}
                        modelLoading={modelLoading}
                        exit={() => setShowSettings(false)}
                    />
                )}
            </SafeAreaView>
        </AstryxScreen>
    )
}

export default ModelManagerScreen
