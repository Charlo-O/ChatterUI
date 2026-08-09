import React from 'react'
import { Switch, View } from 'react-native'

import TText from '@components/text/TText'
import { Theme } from '@lib/theme/ThemeManager'

interface ThemedSwitchProps {
    description?: string
    label?: string
    value: boolean | undefined
    onChangeValue: (b: boolean) => void
}

const ThemedSwitch: React.FC<ThemedSwitchProps> = ({
    description,
    label,
    value,
    onChangeValue,
}) => {
    const { color, spacing } = Theme.useTheme()
    return (
        <View>
            <View
                style={{ flexDirection: 'row', paddingVertical: spacing.m, alignItems: 'center' }}>
                <Switch
                    trackColor={{
                        false: color.neutral._400,
                        true: color.primary._500,
                    }}
                    thumbColor={value ? color.text._900 : color.neutral._200}
                    ios_backgroundColor={color.neutral._400}
                    onValueChange={onChangeValue}
                    value={value}
                />
                {label && (
                    <TText
                        style={{
                            flex: 1,
                            marginLeft: spacing.xl,
                            color: value ? color.text._100 : color.text._400,
                            fontWeight: '500',
                        }}>
                        {label}
                    </TText>
                )}
            </View>
            {description && (
                <TText
                    style={{
                        color: color.text._400,
                        paddingBottom: spacing.xs,
                        marginBottom: spacing.m,
                    }}>
                    {description}
                </TText>
            )}
        </View>
    )
}

export default ThemedSwitch
