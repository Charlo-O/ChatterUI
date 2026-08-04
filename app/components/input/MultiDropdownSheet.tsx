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
}: DropdownSheetProps<T>) => {
    const styles = useDropdownStyles()
    const { color, spacing } = Theme.useTheme()
    const { t } = useI18n()
    const [showList, setShowList] = useState(false)
    const [searchFilter, setSearchFilter] = useState('')

    const items = data.filter((item) =>
        labelExtractor(item)
            ?.toLowerCase()
            .includes(searchFilter.toLowerCase() ?? true)
    )
    return (
        <View style={containerStyle}>
            <BottomSheet
                visible={showList}
                setVisible={setShowList}
                onClose={() => {
                    setSearchFilter('')
                }}>
                <View
                    style={{
                        marginBottom: spacing.xl2,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <TText style={styles.modalTitle}>{modalTitle}</TText>
                    <TText style={styles.counterText}>
                        {selected.length > 0
                            ? t(selected.length > 1 ? 'Selected {{count}} items' : 'Selected {{count}} item', {
                                  count: selected.length,
                              })
                            : t('No items selected')}
                    </TText>
                </View>
                {items.length > 0 ? (
                    <FlatList
                        contentContainerStyle={{ rowGap: 2 }}
                        showsVerticalScrollIndicator={false}
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <DropdownItem
                                label={labelExtractor(item)}
                                active={selected?.some(
                                    (e) => labelExtractor(e) === labelExtractor(item)
                                )}
                                onValueChange={(active) => {
                                    if (!active && selected.length > 0) {
                                        const data = selected.filter(
                                            (e) => labelExtractor(e) !== labelExtractor(item)
                                        )
                                        onChangeValue(data)
                                    } else {
                                        // we duplicate for a fresh reference
                                        const data = [...selected]
                                        if (
                                            selected.some(
                                                (e) => labelExtractor(e) === labelExtractor(item)
                                            )
                                        )
                                            return
                                        data.push(item)
                                        onChangeValue(data)
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
                        placeholder={t('Filter...')}
                        placeholderTextColor={color.text._300}
                        style={styles.searchBar}
                        value={searchFilter}
                        onChangeText={setSearchFilter}
                    />
                )}
            </BottomSheet>
            <Pressable style={[style, styles.button]} onPress={() => setShowList(true)}>
                {selected && selected.length > 0 && (
                    <TText style={styles.buttonText}>{t('Selected {{count}} items', { count: selected.length })}</TText>
                )}
                {(!selected || selected.length === 0) && (
                    <TText style={styles.placeholderText}>{placeholder}</TText>
                )}
                <Entypo name="chevron-down" color={color.primary._800} size={18} />
            </Pressable>
        </View>
    )
}

export default MultiDropdownSheet

export const useDropdownStyles = () => {
    const { color, spacing, borderRadius } = Theme.useTheme()
    return StyleSheet.create({
        button: {
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.m,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: borderRadius.m,
            backgroundColor: color.primary._300,
        },
        buttonText: {
            color: color.text._100,
        },
        placeholderText: {
            color: color.text._300,
        },

        modalTitle: {
            color: color.text._300,
            fontSize: 20,
            fontWeight: '500',
            paddingBottom: spacing.xl2,
        },

        listItem: {
            paddingVertical: spacing.xl,
            paddingHorizontal: spacing.xl2,
        },

        listItemSelected: {
            paddingVertical: spacing.xl,
            paddingHorizontal: spacing.xl2,
            backgroundColor: color.primary._200,
            borderRadius: borderRadius.xl,
        },

        emptyText: {
            color: color.text._400,
            padding: spacing.xl,
        },

        listItemText: {
            color: color.text._200,
            fontSize: 16,
        },

        searchBar: {
            marginTop: spacing.l,
            borderRadius: borderRadius.m,
            padding: spacing.l,
            backgroundColor: color.neutral._200,
            color: color.text._100,
            textAlignVertical: 'center',
        },

        counterText: {
            color: color.text._800,
            fontSize: 14,
            paddingBottom: spacing.xl2,
        },
    })
}
