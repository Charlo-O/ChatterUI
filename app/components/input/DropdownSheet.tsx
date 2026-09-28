import { Entypo } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Pressable, TextInput, View, ViewStyle } from 'react-native'

import TText from '@components/text/TText'
import BottomSheet from '@components/views/BottomSheet'
import { useI18n } from '@lib/i18n'
import { Theme } from '@lib/theme/ThemeManager'

import { useDropdownStyles } from './MultiDropdownSheet'

type DropdownSheetProps<T> = {
    containerStyle?: ViewStyle
    style?: ViewStyle
    data: T[]
    selected?: T | undefined
    onChangeValue: (data: T) => void
    labelExtractor: (data: T) => string
    search?: boolean
    placeholder?: string
    modalTitle?: string
    closeOnSelect?: boolean
    accessibilityLabel?: string
    accessibilityHint?: string
    disabled?: boolean
}

const DropdownSheet = <T,>({
    containerStyle = undefined,
    onChangeValue,
    style,
    selected = undefined,
    data = [],
    placeholder = 'Select Item...',
    modalTitle = 'Select Item',
    labelExtractor = (data) => {
        return data as string
    },
    search = false,
    closeOnSelect = true,
    accessibilityLabel,
    accessibilityHint,
    disabled = false,
}: DropdownSheetProps<T>) => {
    const styles = useDropdownStyles()
    const [showList, setShowList] = useState(false)
    const [searchFilter, setSearchFilter] = useState('')
    const theme = Theme.useTheme()
    const { t } = useI18n()
    const { astryx: tokens } = theme
    const items = data.filter((item) =>
        labelExtractor(item).toLowerCase().includes(searchFilter.toLowerCase())
    )
    const selectedLabel = selected === undefined ? undefined : labelExtractor(selected)
    const triggerLabel = selectedLabel ?? placeholder

    return (
        <View style={containerStyle}>
            <BottomSheet
                visible={showList}
                setVisible={setShowList}
                onClose={() => {
                    setSearchFilter('')
                }}>
                <TText style={styles.modalTitle}>{modalTitle}</TText>
                {items.length > 0 ? (
                    <FlatList
                        contentContainerStyle={{ rowGap: tokens.spacing.hairline }}
                        showsVerticalScrollIndicator={false}
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            const itemLabel = labelExtractor(item)
                            const isSelected = selectedLabel === itemLabel
                            return (
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={itemLabel}
                                    accessibilityState={{ selected: isSelected }}
                                    style={isSelected ? styles.listItemSelected : styles.listItem}
                                    onPress={() => {
                                        onChangeValue(item)
                                        setShowList(!closeOnSelect)
                                    }}>
                                    <TText style={styles.listItemText}>{itemLabel}</TText>
                                </Pressable>
                            )
                        }}
                    />
                ) : (
                    <TText style={styles.emptyText}>No Items</TText>
                )}
                {search && (
                    <TextInput
                        accessibilityLabel={t('Filter...')}
                        placeholder={t('Filter...')}
                        placeholderTextColor={tokens.text.muted}
                        style={styles.searchBar}
                        value={searchFilter}
                        onChangeText={setSearchFilter}
                    />
                )}
            </BottomSheet>
            <Pressable
                style={[style, styles.button, disabled && styles.buttonDisabled]}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel ?? triggerLabel}
                accessibilityHint={accessibilityHint ?? modalTitle}
                accessibilityState={{ disabled: disabled, expanded: showList }}
                disabled={disabled}
                onPress={() => setShowList(true)}>
                {selectedLabel !== undefined ? (
                    <TText style={styles.buttonText}>{selectedLabel}</TText>
                ) : (
                    <TText style={styles.placeholderText}>{placeholder}</TText>
                )}
                <Entypo name="chevron-down" color={tokens.text.secondary} size={18} />
            </Pressable>
        </View>
    )
}

export default DropdownSheet
