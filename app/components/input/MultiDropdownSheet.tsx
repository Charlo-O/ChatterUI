import { Entypo } from '@expo/vector-icons'
import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native'

import TText from '@components/text/TText'
import BottomSheet from '@components/views/BottomSheet'
import { useI18n } from '@lib/i18n'
import { Theme } from '@lib/theme/ThemeManager'

type DropdownItemProps = {
    label: string
    active: boolean
    onValueChange: (b: boolean) => void
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, active, onValueChange }) => {
    const styles = useDropdownStyles()
    return (
        <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={label}
            accessibilityState={{ checked: active }}
            style={active ? styles.listItemSelected : styles.listItem}
            onPress={() => {
                onValueChange(!active)
            }}>
            <TText style={styles.listItemText}>{label}</TText>
        </Pressable>
    )
}

type DropdownSheetProps<T> = {
    containerStyle?: ViewStyle
    style?: ViewStyle
    data: T[]
    selected: T[]
    onChangeValue: (data: T[]) => void
    labelExtractor: (data: T) => string
    search?: boolean
    placeholder?: string
    modalTitle?: string
    closeOnSelect?: boolean
    accessibilityLabel?: string
    accessibilityHint?: string
    disabled?: boolean
}

const MultiDropdownSheet = <T,>({
    containerStyle = undefined,
    onChangeValue,
    style,
    selected,
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
    const { astryx: tokens } = Theme.useTheme()
    const { t } = useI18n()
    const [showList, setShowList] = useState(false)
    const [searchFilter, setSearchFilter] = useState('')

    const items = data.filter((item) =>
        labelExtractor(item)
            ?.toLowerCase()
            .includes(searchFilter.toLowerCase() ?? true)
    )
    const selectedCount = selected?.length ?? 0
    const triggerLabel =
        selectedCount > 0 ? t('Selected {{count}} items', { count: selectedCount }) : placeholder

    return (
        <View style={containerStyle}>
            <BottomSheet
                visible={showList}
                setVisible={setShowList}
                onClose={() => {
                    setSearchFilter('')
                }}>
                <View style={styles.modalHeader}>
                    <TText style={styles.modalTitle}>{modalTitle}</TText>
                    <TText style={styles.counterText}>
                        {selectedCount > 0
                            ? t(
                                  selectedCount > 1
                                      ? 'Selected {{count}} items'
                                      : 'Selected {{count}} item',
                                  { count: selectedCount }
                              )
                            : t('No items selected')}
                    </TText>
                </View>
                {items.length > 0 ? (
                    <FlatList
                        contentContainerStyle={{ rowGap: tokens.spacing.hairline }}
                        showsVerticalScrollIndicator={false}
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <DropdownItem
                                label={labelExtractor(item)}
                                active={selected?.some(
                                    (e) => labelExtractor(e) === labelExtractor(item)
                                )}
                                onValueChange={(active) => {
                                    if (!active && selected.length > 0) {
                                        const next = selected.filter(
                                            (e) => labelExtractor(e) !== labelExtractor(item)
                                        )
                                        onChangeValue(next)
                                    } else {
                                        // Duplicate for a fresh reference, preserving existing callers' behavior.
                                        const next = [...selected]
                                        if (
                                            selected.some(
                                                (e) => labelExtractor(e) === labelExtractor(item)
                                            )
                                        )
                                            return
                                        next.push(item)
                                        onChangeValue(next)
                                    }
                                }}
                            />
                        )}
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
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel ?? triggerLabel}
                accessibilityHint={accessibilityHint ?? modalTitle}
                accessibilityState={{ disabled: disabled, expanded: showList }}
                disabled={disabled}
                style={[style, styles.button, disabled && styles.buttonDisabled]}
                onPress={() => setShowList(true)}>
                {selectedCount > 0 ? (
                    <TText style={styles.buttonText}>{triggerLabel}</TText>
                ) : (
                    <TText style={styles.placeholderText}>{placeholder}</TText>
                )}
                <Entypo name="chevron-down" color={tokens.text.secondary} size={18} />
            </Pressable>
        </View>
    )
}

export default MultiDropdownSheet

export const useDropdownStyles = () => {
    const { astryx: tokens } = Theme.useTheme()
    return StyleSheet.create({
        button: {
            minHeight: tokens.size.lg,
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: tokens.spacing.sm,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: tokens.radius.element,
            borderWidth: 1,
            borderColor: tokens.border.default,
            backgroundColor: tokens.background.muted,
        },
        buttonDisabled: {
            opacity: 0.52,
        },
        buttonText: {
            color: tokens.text.primary,
            fontSize: 14,
            fontWeight: '500',
        },
        placeholderText: {
            color: tokens.text.muted,
            fontSize: 14,
        },

        modalHeader: {
            marginBottom: tokens.spacing.xl,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: tokens.spacing.md,
        },

        modalTitle: {
            color: tokens.text.primary,
            fontSize: 20,
            fontWeight: '600',
            paddingBottom: tokens.spacing.sm,
        },

        listItem: {
            minHeight: tokens.size.lg,
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.md,
            justifyContent: 'center',
            borderRadius: tokens.radius.inner,
        },

        listItemSelected: {
            minHeight: tokens.size.lg,
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.md,
            justifyContent: 'center',
            backgroundColor: tokens.accent.muted,
            borderRadius: tokens.radius.inner,
            borderWidth: 1,
            borderColor: tokens.border.default,
        },

        emptyText: {
            color: tokens.text.muted,
            padding: tokens.spacing.xl,
            textAlign: 'center',
        },

        listItemText: {
            color: tokens.text.primary,
            fontSize: 16,
        },

        searchBar: {
            marginTop: tokens.spacing.lg,
            minHeight: tokens.size.lg,
            borderRadius: tokens.radius.element,
            borderWidth: 1,
            borderColor: tokens.border.default,
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: tokens.spacing.sm,
            backgroundColor: tokens.background.surface,
            color: tokens.text.primary,
            textAlignVertical: 'center',
        },

        counterText: {
            color: tokens.text.secondary,
            fontSize: 14,
            paddingBottom: tokens.spacing.sm,
            textAlign: 'right',
        },
    })
}
