import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'
import { useShallow } from 'zustand/react/shallow'

import { Llama } from '@lib/engine/Local/LlamaLocal'
import { useI18n } from '@lib/i18n'
import { Theme } from '@lib/theme/ThemeManager'

import TText from '@components/text/TText'

type ModelInfoHeaderProps = {
    modelImporting: boolean
    modelLoading: boolean
    modelListLength: number
    modelUpdatedAt: Date | undefined
}

const ModelInfoHeader: React.FC<ModelInfoHeaderProps> = ({
    modelImporting,
    modelLoading,
    modelListLength,
    modelUpdatedAt,
}) => {
    const styles = useStyles()
    const { color } = Theme.useTheme()
    const { t } = useI18n()

    const { modelName, loadProgress } = Llama.useLlamaModelStore(
        useShallow((state) => ({
            modelName: state.model?.name,
            loadProgress: state.loadProgress,
        }))
    )

    return (
        <View style={styles.modelContainer}>
            {!modelImporting && !modelLoading && modelListLength !== 0 && (
                <TText style={styles.subtitle}>
                    {t('Model Loaded:')}{' '}
                    <TText style={styles.modelTitle} ellipsizeMode="tail" numberOfLines={1}>
                        {modelName ?? 'None'}
                    </TText>
                </TText>
            )}
            {!modelImporting && !modelLoading && modelListLength === 0 && modelUpdatedAt && (
                <View>
                    <TText style={styles.hint}>
                        {t('Hint: Press')} <AntDesign name="file-add" size={16} />{' '}
                        {t('and import a GGUF model!')}
                    </TText>
                </View>
            )}

            {!modelLoading && modelImporting && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Progress.Bar
                        style={{ flex: 5 }}
                        indeterminate
                        indeterminateAnimationDuration={2000}
                        color={color.primary._500}
                        borderColor={color.neutral._300}
                        height={12}
                        borderRadius={12}
                        width={null}
                    />

                    <TText
                        style={{
                            flex: 2,
                            color: color.text._100,
                            textAlign: 'center',
                        }}>
                        Importing...
                    </TText>
                </View>
            )}

            {modelLoading && !modelImporting && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Progress.Bar
                        style={{ flex: 5 }}
                        progress={loadProgress / 100}
                        color={color.primary._500}
                        borderColor={color.neutral._300}
                        height={12}
                        borderRadius={12}
                        width={null}
                    />
                    <TText
                        style={{
                            flex: 1,
                            color: color.text._100,
                            textAlign: 'center',
                        }}>
                        {loadProgress}%
                    </TText>
                </View>
            )}
        </View>
    )
}

export default ModelInfoHeader

export const useStyles = () => {
    const { color, spacing, borderRadius, fontSize } = Theme.useTheme()

    return StyleSheet.create({
        mainContainer: {
            paddingTop: spacing.xl,
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xl2,
            flex: 1,
        },

        list: {
            marginTop: 16,
            flex: 1,
        },

        modelContainer: {
            borderRadius: borderRadius.l,
            paddingVertical: spacing.l,
            paddingHorizontal: spacing.xl2,
            backgroundColor: color.neutral._200,
            marginBottom: spacing.l,
        },

        title: {
            fontSize: fontSize.l,
            color: color.text._100,
        },

        modelTitle: {
            color: color.primary._700,
            flex: 1,
        },

        subtitle: {
            color: color.text._300,
        },

        hint: {
            color: color.text._400,
        },
    })
}
