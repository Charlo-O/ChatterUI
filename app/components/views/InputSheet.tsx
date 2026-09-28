import { getStringAsync } from 'expo-clipboard'
import React, { useState } from 'react'
import { View } from 'react-native'

import ThemedButton from '@components/buttons/ThemedButton'
import ThemedTextInput from '@components/input/ThemedTextInput'
import TText from '@components/text/TText'
import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'

import BottomSheet from './BottomSheet'

export type InputSheetProps = {
    visible: boolean
    setVisible: (visible: boolean) => void
    onConfirm: (text: string) => void
    onClose?: () => void
    title?: string
    description?: string
    placeholder?: string
    verifyText?: (text: string) => string
    errorMessage?: string
    autoFocus?: boolean
    defaultValue?: string
    multiline?: boolean
}

const InputSheet: React.FC<InputSheetProps> = ({
    visible,
    setVisible,
    onConfirm = (text) => {},
    onClose = () => {},
    title = '',
    description = '',
    placeholder = '',
    verifyText = (text: string) => '',
    autoFocus = false,
    defaultValue = '',
    multiline = false,
}) => {
    const [text, setText] = useState(defaultValue)
    const [errorMessage, setErrorMessage] = useState('')
    const tokens = useAstryxTokens()

    const handleClose = () => {
        setVisible(false)
        onClose()
        setErrorMessage('')
    }

    return (
        <BottomSheet visible={visible} setVisible={setVisible} onClose={handleClose}>
            <View style={{ rowGap: tokens.spacing.xl }}>
                {Boolean(title) && (
                    <TText
                        style={{
                            color: tokens.text.primary,
                            fontSize: 20,
                            paddingLeft: tokens.spacing.sm,
                        }}>
                        {title}
                    </TText>
                )}
                {Boolean(description) && (
                    <TText
                        style={{
                            color: tokens.text.secondary,
                        }}>
                        {description}
                    </TText>
                )}

                <View style={{ flexDirection: 'row', columnGap: tokens.spacing.md }}>
                    <ThemedTextInput
                        multiline={multiline}
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        value={text}
                        onChangeText={setText}
                        containerStyle={{ flex: 1 }}
                        numberOfLines={multiline ? 10 : 1}
                    />
                </View>
                {Boolean(errorMessage) && (
                    <TText style={{ color: tokens.status.error }}>{errorMessage}</TText>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <ThemedButton label="Cancel" variant="secondary" onPress={handleClose} />
                    <View
                        style={{
                            flexDirection: 'row',
                            columnGap: tokens.spacing.xl,
                            justifyContent: 'flex-end',
                        }}>
                        <ThemedButton
                            accessibilityLabel="Clear input"
                            iconStyle={{ color: tokens.text.secondary }}
                            iconName="close"
                            variant="tertiary"
                            onPress={() => setText('')}
                        />
                        <ThemedButton
                            accessibilityLabel="Paste from clipboard"
                            iconStyle={{ color: tokens.text.secondary }}
                            iconName="copy"
                            variant="tertiary"
                            onPress={async () => {
                                const paste = await getStringAsync()
                                if (paste) setText((text) => text + paste)
                            }}
                        />
                    </View>
                    <ThemedButton
                        label="Confirm"
                        onPress={() => {
                            const result = verifyText(text)
                            if (result) setErrorMessage(result)
                            else {
                                onConfirm(text)
                                handleClose()
                            }
                        }}
                    />
                </View>
            </View>
        </BottomSheet>
    )
}

export default InputSheet
