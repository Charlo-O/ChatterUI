import React, { ReactNode } from 'react'
import { Modal, View, ViewStyle } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import GlassSurface from '@components/liquid/GlassSurface'
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
    const { spacing } = Theme.useTheme()
    const tokens = useAstryxTokens()
    const insets = useSafeAreaInsets()
    const { height } = useReanimatedKeyboardAnimation()
    const animatedStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: Math.max(0, -height.value - insets.bottom),
            flex: 1,
            justifyContent: 'flex-end',
        }
    })
    const handleClose = () => {
        setVisible(false)
        onClose?.()
    }
    return (
        <Modal
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={handleClose}
            style={{
                flex: 1,
            }}
            visible={visible}
            animationType="fade">
            <Animated.View style={[animatedStyle]}>
                <FadeBackrop handleOverlayClick={handleClose} />

                <GlassSurface
                    accessibilityViewIsModal
                    style={[
                        {
                            paddingTop: spacing.xl2,
                            paddingBottom: insets.bottom + spacing.xl2,
                            paddingHorizontal: spacing.xl2,
                            maxHeight: '70%',
                            width: '100%',
                            maxWidth: 680,
                            alignSelf: 'center',
                            borderTopLeftRadius: tokens.radius.container,
                            borderTopRightRadius: tokens.radius.container,
                            borderColor: tokens.border.default,
                            borderTopWidth: 1,
                        },
                        sheetStyle,
                    ]}>
                    <View
                        pointerEvents="none"
                        style={{
                            width: 36,
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: tokens.border.emphasized,
                            alignSelf: 'center',
                            marginTop: -10,
                            marginBottom: 16,
                        }}
                    />
                    {children}
                </GlassSurface>
            </Animated.View>
        </Modal>
    )
}

export default BottomSheet
