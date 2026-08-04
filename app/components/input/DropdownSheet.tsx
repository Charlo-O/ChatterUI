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
}: DropdownSheetProps<T>) => {
    const styles = useDropdownStyles()
    const [showList, setShowList] = useState(false)
    const [searchFilter, setSearchFilter] = useState('')
    const theme = Theme.useTheme()
    const { t } = useI18n()
    const items = data.filter((item) =>
        labelExtractor(item).toLowerCase().includes(searchFilter.toLowerCase())
    )
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
                        contentContainerStyle={{ rowGap: 2 }}
                        showsVerticalScrollIndicator={false}
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={
                                    selected && labelExtractor(item) === labelExtractor(selected)
                                        ? styles.listItemSelected
                                        : styles.listItem
                                }
                                onPress={() => {
                                    onChangeValue(item)
                                    setShowList(!closeOnSelect)
                                }}>
                                <TText style={styles.listItemText}>{labelExtractor(item)}</TText>
                            </Pressable>
                        )}
                    />
                ) : (
                    <TText style={styles.emptyText}>No Items</TText>
                )}
                {search && (
                    <TextInput
                        placeholder={t('Filter...')}
                        placeholderTextColor={theme.color.text._300}
                        style={styles.searchBar}
                        value={searchFilter}
                        onChangeText={setSearchFilter}
                    />
                )}
            </BottomSheet>
            <Pressable style={[style, styles.button]} onPress={() => setShowList(true)}>
                {selected && <TText style={styles.buttonText}>{labelExtractor(selected)}</TText>}
                {!selected && <TText style={styles.placeholderText}>{placeholder}</TText>}
                <Entypo name="chevron-down" color={theme.color.primary._800} size={18} />
            </Pressable>
        </View>
    )
}

export default DropdownSheet
