import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import ThemedSwitch from '@components/input/ThemedSwitch'
import Alert from '@components/views/Alert'
import { APIManagerValue, APIManager } from '@lib/engine/API/APIManagerState'
import { Theme } from '@lib/theme/ThemeManager'

import ConnectionEditor from './ConnectionEditor'

type ConnectionItemProps = {
    item: APIManagerValue
    index: number
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ item, index }) => {
    const { spacing } = Theme.useTheme()
    const styles = useStyles()
    const [showEditor, setShowEditor] = useState(false)
    const { removeValue, editValue } = APIManager.useConnectionsStore(
        useShallow((state) => ({
            removeValue: state.removeValue,
            editValue: state.editValue,
        }))
    )

    const handleDelete = () => {
        Alert.alert({
            title: 'Delete API Entry',
            description: `Are you sure you want to delete "${item.friendlyName}"?`,
            buttons: [
                { label: 'Cancel' },
                {
                    label: 'Delete API',
                    onPress: () => {
                        removeValue(index)
                    },
                    type: 'warning',
                },
            ],
        })
    }

    return (
        <View style={item.active ? styles.longContainer : styles.longContainerInactive}>
            <ConnectionEditor
                index={index}
                originalValues={item}
                show={showEditor}
                close={() => {
                    setShowEditor(false)
                }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <ThemedSwitch
                    accessibilityLabel={`Enable ${item.friendlyName}`}
                    value={item.active}
                    onChangeValue={(value) => {
                        editValue({ ...item, active: value }, index)
                    }}
                />

                <View style={{ marginLeft: spacing.l, flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={item.active ? styles.name : styles.nameInactive}>
                        {item.friendlyName}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={item.active ? styles.config : styles.configInactive}>
                        Config: {item.configName}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <ThemedButton
                    accessibilityLabel="Delete connection"
                    onPress={handleDelete}
                    variant="critical"
                    iconName="delete"
                    iconSize={24}
                    buttonStyle={{ borderWidth: 0, width: 44, paddingHorizontal: 0 }}
                />
                <ThemedButton
                    accessibilityLabel="Edit connection"
                    onPress={() => setShowEditor(true)}
                    variant="tertiary"
                    iconName="edit"
                    iconSize={24}
                    buttonStyle={{ borderWidth: 0, width: 44, paddingHorizontal: 0 }}
                />
            </View>
        </View>
    )
}

export default ConnectionItem

const useStyles = () => {
    const { astryx: tokens, spacing, fontSize } = Theme.useTheme()
    return StyleSheet.create({
        longContainer: {
            backgroundColor: tokens.background.card,
            borderColor: tokens.border.default,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: tokens.radius.container,
            minHeight: 80,
            gap: 12,
            paddingLeft: spacing.xl,
            paddingRight: spacing.xl,
            paddingVertical: spacing.xl,
        },

        longContainerInactive: {
            backgroundColor: tokens.background.card,
            borderColor: tokens.border.default,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: tokens.radius.container,
            minHeight: 80,
            gap: 12,
            paddingLeft: spacing.xl,
            paddingRight: spacing.xl,
            paddingVertical: spacing.xl,
        },

        name: {
            fontSize: fontSize.l,
            color: tokens.text.primary,
            fontWeight: '600',
        },

        nameInactive: {
            fontSize: fontSize.l,
            color: tokens.text.secondary,
        },

        config: {
            color: tokens.text.secondary,
            fontSize: 13,
            marginTop: 4,
        },

        configInactive: {
            color: tokens.text.muted,
            fontSize: 13,
            marginTop: 4,
        },
    })
}
