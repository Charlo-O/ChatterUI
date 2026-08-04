import { TextInput, TextInputProps, View, ViewStyle } from 'react-native'

import TText from '@components/text/TText'
import { useI18n } from '@lib/i18n'
import { useUnfocusTextInput } from '@lib/hooks/UnfocusTextInput'
import { Theme } from '@lib/theme/ThemeManager'

interface ThemedTextInputProps extends TextInputProps {
    label?: string
    description?: string
    value: string
    containerStyle?: ViewStyle
    autoUnfocus?: boolean
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
    label,
    description,
    numberOfLines,
    multiline = false,
    placeholder,
    style = undefined,
    autoUnfocus = true,
    containerStyle = {},
    ...rest
}) => {
    const { color } = Theme.useTheme()
    const { t } = useI18n()
    const ref = useUnfocusTextInput()

    return (
        <View
            style={{
                flex: 1,
                ...containerStyle,
            }}>
            {label && (
                <TText
                    style={{
                        color: color.text._100,
                        marginBottom: 8,
                    }}>
                    {label}
                </TText>
            )}
            <TextInput
                ref={autoUnfocus ? ref : null}
                multiline={(!!numberOfLines && numberOfLines > 1) || multiline}
                numberOfLines={numberOfLines}
                style={[
                    {
                        color: color.text._100,
                        borderColor: color.neutral._400,
                        borderWidth: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        textAlignVertical: numberOfLines && numberOfLines > 1 ? `top` : `center`,
                    },
                    style,
                ]}
                placeholder={placeholder ? t(placeholder) : '----'}
                placeholderTextColor={color.text._500}
                {...rest}
            />
        </View>
    )
}

export default ThemedTextInput
