import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import TText from '@components/text/TText'
import { CharacterSorter, SearchType } from '@lib/state/CharacterSorter'
import { Theme } from '@lib/theme/ThemeManager'

type SortButtonProps = {
    type: SearchType
    label: string
}

const SortButton: React.FC<SortButtonProps> = ({ type, label }) => {
    const styles = useStyles()
    const { color } = Theme.useTheme()
    const { searchType, setSearchType, searchOrder, setSearchOrder } =
        CharacterSorter.useSorterStore(
            useShallow((state) => ({
                searchType: state.searchType,
                setSearchType: state.setType,
                searchOrder: state.searchOrder,
                setSearchOrder: state.setOrder,
            }))
        )

    const isCurrent = type === searchType

    return (
        <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isCurrent }}
            accessibilityLabel={`${label} sort`}
            onPress={() => {
                setSearchOrder(searchType !== type || searchOrder === 'asc' ? 'desc' : 'asc')
                setSearchType(type)
            }}
            style={({ pressed }) => [
                isCurrent ? styles.sortButtonActive : styles.sortButton,
                { opacity: pressed ? 0.72 : 1 },
            ]}>
            {isCurrent && (
                <AntDesign
                    size={14}
                    name={
                        (searchOrder === 'asc' && type === 'modified') ||
                        (searchOrder === 'desc' && type === 'name')
                            ? 'caret-up'
                            : 'caret-down'
                    }
                    color={color.text._900}
                />
            )}
            <TText style={isCurrent ? styles.sortButtonTextActive : styles.sortButtonText}>
                {label}
            </TText>
        </Pressable>
    )
}

export default SortButton

const useStyles = () => {
    const { color, spacing, borderRadius } = Theme.useTheme()

    return StyleSheet.create({
        sortButton: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.sm,
            backgroundColor: color.neutral._300,
            borderRadius: borderRadius.m,
            borderWidth: 1,
            borderColor: color.neutral._400,
        },

        sortButtonActive: {
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.sm,
            backgroundColor: color.primary._500,
            borderRadius: borderRadius.m,
            borderWidth: 1,
            borderColor: color.primary._500,
        },

        sortButtonText: {
            color: color.text._400,
        },

        sortButtonTextActive: {
            marginLeft: 4,
            color: color.text._900,
            fontWeight: '600',
        },
    })
}
