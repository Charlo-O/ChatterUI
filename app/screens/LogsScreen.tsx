import { FlashList } from '@shopify/flash-list'
import { Text } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { AstryxCard, AstryxEmptyState, useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import { AstryxScreen } from '@components/astryx/AstryxShell'
import Alert from '@components/views/Alert'
import ContextMenu from '@components/views/ContextMenu'
import { Logger, LogLevel } from '@lib/state/Logger'
import { saveStringToDownload } from '@lib/utils/File'

const LogsScreen = () => {
    const tokens = useAstryxTokens()
    const { logs, flushLogs } = Logger.useLoggerStore(
        useShallow((state) => ({
            logs: state.logs,
            flushLogs: state.flushLogs,
        }))
    )

    const handleExportLogs = () => {
        if (!logs) return
        const data = logs
            .map((item) => `${Logger.LevelName[item.level]} ${item.timestamp}: ${item.message}`)
            .join('\n')
        saveStringToDownload(data, `logs-chatterui-${Date.now()}.txt`, 'utf8')
            .then(() => {
                Logger.infoToast('Logs Downloaded!')
            })
            .catch((e) => {
                Logger.errorToast(`Could Not Export Logs: ${e}`)
            })
    }

    const handleFlushLogs = () => {
        Alert.alert({
            title: `Delete Logs`,
            description: `Are you sure you want to delete all logs? This cannot be undone.`,
            buttons: [
                { label: 'Cancel' },
                {
                    label: 'Delete Logs',
                    onPress: async () => {
                        flushLogs()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    const logColor: Record<LogLevel, string> = {
        [LogLevel.INFO]: tokens.text.primary,
        [LogLevel.WARN]: tokens.status.warning,
        [LogLevel.ERROR]: tokens.status.error,
        [LogLevel.DEBUG]: tokens.text.muted,
    }

    const headerRight = () => (
        <ContextMenu
            triggerAccessibilityLabel="Log actions"
            placement="bottom"
            triggerIcon="setting"
            buttons={[
                {
                    label: 'Export Logs',
                    icon: 'export',
                    onPress: (close) => {
                        handleExportLogs()
                        close()
                    },
                },
                {
                    label: 'Flush Logs',
                    icon: 'delete',
                    onPress: (close) => {
                        handleFlushLogs()
                        close()
                    },
                    variant: 'warning',
                },
            ]}
        />
    )

    return (
        <AstryxScreen
            title="Logs"
            subtitle="Runtime diagnostics"
            actions={headerRight()}>
            <AstryxCard
                muted
                style={{
                    borderColor: tokens.border.default,
                    flex: 1,
                    margin: 16,
                    padding: 16,
                }}>
                <FlashList
                    maintainVisibleContentPosition={{ startRenderingFromBottom: true }}
                    data={logs ?? []}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Text
                            style={{
                                fontSize: 12,
                                color: logColor[item.level],
                            }}>
                            {Logger.LevelName[item.level]} {item.timestamp}: {item.message}
                        </Text>
                    )}
                    ListEmptyComponent={
                        <AstryxEmptyState
                            icon="description"
                            title="No logs yet"
                            description="Runtime events will appear here when the app has something to report."
                        />
                    }
                />
            </AstryxCard>
        </AstryxScreen>
    )
}

export default LogsScreen
