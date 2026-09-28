import { useState } from 'react'
import { FlatList, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { AstryxEmptyState } from '@components/astryx/AstryxPrimitives'
import { AstryxScreen } from '@components/astryx/AstryxShell'
import ContextMenu from '@components/views/ContextMenu'
import InputSheet from '@components/views/InputSheet'
import { APIManager } from '@lib/engine/API/APIManagerState'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { pickJSONDocument } from '@lib/utils/File'

import TemplateItem from './TemplateItem'

const TemplateManager = () => {
    // eslint-disable-next-line react-compiler/react-compiler
    'use no memo'
    const { templates, addTemplate } = APIManager.useConnectionsStore(
        useShallow((state) => ({
            templates: state.customTemplates,
            addTemplate: state.addTemplate,
        }))
    )
    const [showPaste, setShowPaste] = useState(false)
    const { spacing } = Theme.useTheme()
    const actions = (
        <ContextMenu
            triggerAccessibilityLabel="Template actions"
            triggerIcon="setting"
            placement="bottom"
            buttons={[
                {
                    label: 'Import Template',
                    icon: 'download',
                    onPress: async (close) => {
                        close()
                        const result = await pickJSONDocument()
                        if (!result.success) return
                        addTemplate(result.data)
                    },
                },
                {
                    label: 'Paste Template',
                    icon: 'file',
                    onPress: (close) => {
                        close()
                        setShowPaste(true)
                    },
                },
                {
                    label: 'Get Templates',
                    icon: 'github',
                    onPress: (close) => {
                        close()
                        Linking.openURL('https://github.com/Vali-98/ChatterUI/discussions/126')
                    },
                },
                {
                    label: 'Learn About Templates',
                    icon: 'info',
                    onPress: (close) => {
                        close()
                        Linking.openURL(
                            'https://github.com/Vali-98/ChatterUI/blob/dev/docs/CustomTemplates.md'
                        )
                    },
                },
            ]}
        />
    )

    return (
        <AstryxScreen
            title="Template Manager"
            subtitle="Reusable API request templates"
            showMenu={false}
            actions={actions}>
            <SafeAreaView
                edges={['bottom']}
                style={{
                    paddingHorizontal: spacing.xl,
                    paddingBottom: spacing.xl2,
                    flex: 1,
                }}>
            <InputSheet
                visible={showPaste}
                setVisible={setShowPaste}
                onConfirm={(e) => {
                    try {
                        const data = JSON.parse(e)
                        addTemplate(data)
                    } catch (e) {
                        Logger.errorToast('Failed to import: ' + e)
                    }
                }}
                multiline
                title="Paste Template Here"
            />
            {templates.length > 0 && (
                <FlatList
                    contentContainerStyle={{ rowGap: 4 }}
                    data={templates}
                    keyExtractor={(item, index) => item.name}
                    renderItem={({ item, index }) => <TemplateItem item={item} index={index} />}
                />
            )}

            {templates.length === 0 && (
                <AstryxEmptyState
                    icon="description"
                    title="No custom templates"
                    description="Import or paste a template to reuse an API configuration."
                    actionLabel="Paste template"
                    onAction={() => setShowPaste(true)}
                />
            )}
            </SafeAreaView>
        </AstryxScreen>
    )
}

export default TemplateManager
