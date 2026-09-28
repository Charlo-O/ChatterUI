import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    Pressable,
    StyleProp,
    View,
    StyleSheet,
    ViewStyle,
    ScrollView,
} from 'react-native'

import ThemedButton from '@components/buttons/ThemedButton'
import ThemedTextInput from '@components/input/ThemedTextInput'
import TText from '@components/text/TText'
import { useI18n } from '@lib/i18n'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'

type StringArrayEditorProps = {
    containerStyle?: StyleProp<ViewStyle>
    label?: string
    value: string[]
    setValue: (newdata: string[]) => void
    allowDuplicates?: boolean
    placeholder?: string
    replaceNewLine?: string
    allowBlank?: string
    suggestions?: string[]
    filterOnly?: boolean
    showSuggestionsOnEmpty?: boolean
}

const StringArrayEditor: React.FC<StringArrayEditorProps> = ({
    containerStyle = undefined,
    label = undefined,
    value,
    setValue,
    replaceNewLine = undefined,
    allowDuplicates = false,
    placeholder = 'Enter value...',
    allowBlank = false,
    suggestions = [],
    filterOnly = false,
    showSuggestionsOnEmpty = false,
}) => {
    const { astryx: tokens } = Theme.useTheme()
    const { t } = useI18n()
    const styles = useStyles()
    const [newData, setNewData] = useState('')
    const filteredSuggestions = suggestions.filter(
        (item) => item.toLowerCase().includes(newData.toLowerCase()) && !value.includes(item)
    )
    const handleSplice = (index: number) => {
        setValue(value.filter((item, index2) => index2 !== index))
    }

    const addData = (newData: string) => {
        if (newData === '') {
            Logger.warnToast('Value cannot be empty')
            return
        }
        if (!allowDuplicates && value.includes(newData)) {
            Logger.warnToast('Value already exists')
            return
        }
        setNewData('')
        setValue([...value, newData])
    }

    return (
        <View style={[styles.mainContainer, containerStyle]}>
            {label && <TText style={styles.title}>{label}</TText>}

            <View style={styles.contentContainer}>
                {value.length !== 0 && (
                    <View style={styles.tagContainer}>
                        {value.map((item, index) => (
                            <Pressable
                                key={index}
                                style={styles.tag}
                                onPress={() => handleSplice(index)}
                                accessibilityRole="button"
                                accessibilityLabel={`${t('Remove')} ${item}`}>
                                <TText style={styles.tagText}>
                                    {item.replaceAll('\n', replaceNewLine ?? '\n')}
                                </TText>
                                <AntDesign name="close" size={16} color={tokens.text.secondary} />
                            </Pressable>
                        ))}
                    </View>
                )}
                {(newData || showSuggestionsOnEmpty) && filteredSuggestions.length > 0 && (
                    <View style={styles.suggestionsRow}>
                        {!filterOnly && (
                            <TText style={styles.suggestionsLabel}>{t('Suggestions')}</TText>
                        )}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                            style={styles.suggestionsScroll}
                            contentContainerStyle={styles.suggestionsContent}>
                            {filteredSuggestions.map((item, index) => (
                                <ThemedButton
                                    size="sm"
                                    onPress={() => addData(item)}
                                    variant="secondary"
                                    label={item}
                                    key={index}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <ThemedTextInput
                        containerStyle={styles.inputWrapper}
                        style={styles.input}
                        value={newData}
                        onChangeText={setNewData}
                        multiline
                        numberOfLines={2}
                        placeholder={t(placeholder)}
                        accessibilityLabel={label ? `${label} input` : t('Enter value')}
                    />

                    {!filterOnly && (
                        <ThemedButton
                            label="Add"
                            onPress={() => addData(newData)}
                            accessibilityLabel={t('Add value')}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default StringArrayEditor

const useStyles = () => {
    const { astryx: tokens } = Theme.useTheme()

    return StyleSheet.create({
        mainContainer: {
            flex: 1,
        },

        contentContainer: {
            borderWidth: 1,
            borderColor: tokens.border.default,
            paddingHorizontal: tokens.spacing.sm,
            paddingVertical: tokens.spacing.sm,
            borderRadius: tokens.radius.element,
            backgroundColor: tokens.background.surface,
        },

        title: {
            color: tokens.text.primary,
            marginBottom: tokens.spacing.md,
            fontWeight: '600',
        },

        tagContainer: {
            flexDirection: 'row',
            columnGap: tokens.spacing.sm,
            rowGap: tokens.spacing.sm,
            paddingBottom: tokens.spacing.md,
            marginBottom: tokens.spacing.md,
            borderBottomWidth: 1,
            borderColor: tokens.border.default,
            flexWrap: 'wrap',
        },

        tag: {
            borderColor: tokens.border.emphasized,
            borderWidth: 1,
            paddingVertical: tokens.spacing.xs,
            paddingLeft: tokens.spacing.md,
            paddingRight: tokens.spacing.sm,
            borderRadius: tokens.radius.full,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tokens.background.muted,
        },

        tagText: {
            color: tokens.text.primary,
            marginRight: tokens.spacing.sm,
        },

        suggestionsRow: {
            marginBottom: tokens.spacing.xs,
            flexDirection: 'row',
            columnGap: tokens.spacing.xs,
            alignItems: 'center',
        },

        suggestionsLabel: {
            color: tokens.text.secondary,
            marginBottom: tokens.spacing.xs,
        },

        suggestionsScroll: {
            borderRadius: tokens.radius.element,
            flex: 1,
        },

        suggestionsContent: {
            backgroundColor: tokens.background.muted,
            flexDirection: 'row',
            columnGap: tokens.spacing.xs,
            padding: tokens.spacing.xs,
        },

        inputWrapper: {
            flex: 1,
        },

        input: {
            minHeight: tokens.size.lg,
        },

        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: tokens.spacing.sm,
        },
    })
}
