import React, { ReactNode } from 'react'
import { Modal, View, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Theme } from '@lib/theme/ThemeManager'

import FadeBackrop from './FadeBackdrop'

export interface BottomSheetProps {
    visible: boolean
    setVisible: (visible: boolean) => void
    children: ReactNode
    sheetStyle?: ViewStyle
    onClose?: () => void
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    setVisible,
    children,
    onClose,
    sheetStyle,
}) => {
    const { color, spacing, borderRadius } = Theme.useTheme()
    const insets = useSafeAreaInsets()
    const { height } = useReanimatedKeyboardAnimation()
    const animatedStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: -height.value - insets.bottom,
            flex: 1,
            justifyContent: 'flex-end',
        }
    })
    return (
        <Modal
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={() => {
                setVisible(false)
                onClose?.()
            }}
            style={{
                flex: 1,
            }}
            visible={visible}
            animationType="fade">
            <Animated.View style={[animatedStyle]}>
                <FadeBackrop handleOverlayClick={() => setVisible(false)} />

                <View
                    style={[
                        {
                            paddingTop: spacing.xl2,
                            paddingBottom: insets.bottom + spacing.xl2,
                            paddingHorizontal: spacing.xl2,
                            maxHeight: '70%',
                            width: '100%',
                            borderTopLeftRadius: borderRadius.xl2,
                            borderTopRightRadius: borderRadius.xl2,
                            borderColor: color.neutral._400,
                            borderTopWidth: 1,
                            backgroundColor: color.neutral._200,
                        },
                        sheetStyle,
                    ]}>
                    {children}
                </View>
            </Animated.View>
        </Modal>
    )
}

export default BottomSheet
