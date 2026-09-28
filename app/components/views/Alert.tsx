import { Modal, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import FadeBackrop from '@components/views/FadeBackdrop'
import { AstryxButton, useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import { useI18n } from '@lib/i18n'
import { AlertButtonProps, AlertProps, useAlertStore } from '@lib/state/components/Alert'
import { Theme } from '@lib/theme/ThemeManager'

namespace Alert {
    export const alert = (props: AlertProps) => {
        useAlertStore.getState().show(props)
    }
}

export default Alert

const AlertButton: React.FC<AlertButtonProps> = ({ label, onPress, type = 'default' }) => {
    const { t } = useI18n()
    const isDismissAction = /^(cancel|no|close)$/i.test(label.trim())
    return (
        <AstryxButton
            label={t(label)}
            variant={type === 'warning' ? 'destructive' : isDismissAction ? 'ghost' : 'primary'}
            accessibilityLabel={t(label)}
            onPress={async () => {
                useAlertStore.getState().hide()
                onPress && onPress()
            }}
        />
    )
}

export const AlertProvider = () => {
    const styles = useStyles()
    const { t } = useI18n()
    const { visible, props } = useAlertStore(
        useShallow((state) => ({ visible: state.visible, props: state.props }))
    )
    const handleDismiss = () => {
        const dismiss = props.onDismiss
        if (dismiss) {
            dismiss()
        }
        hide()
    }
    const hide = useAlertStore((state) => state.hide)

    return (
        <Modal
            visible={visible}
            transparent
            style={styles.modal}
            animationType="fade"
            statusBarTranslucent
            navigationBarTranslucent
            onRequestClose={handleDismiss}>
            <FadeBackrop handleOverlayClick={handleDismiss} />
            <Animated.View style={styles.textBoxContainer} entering={FadeInDown.duration(150)} accessibilityViewIsModal>
                <View style={styles.textBox}>
                    <Text style={styles.title}>{t(props.title)}</Text>
                    <Text style={styles.description}>{t(props.description)}</Text>
                    <View style={styles.buttonContainer}>
                        {props.buttons.map((item, index) => (
                            <AlertButton {...item} key={index} />
                        ))}
                    </View>
                </View>
            </Animated.View>
        </Modal>
    )
}

const useStyles = () => {
    const { spacing, fontSize } = Theme.useTheme()
    const tokens = useAstryxTokens()

    return StyleSheet.create({
        modal: {
            flex: 1,
        },
        textBoxContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        textBox: {
            backgroundColor: tokens.background.popover,
            borderColor: tokens.border.default,
            borderWidth: 1,
            paddingHorizontal: spacing.xl2,
            paddingBottom: spacing.xl,
            paddingTop: spacing.xl2,
            borderRadius: tokens.radius.container,
            width: '88%',
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 12,
                    blurRadius: 32,
                    color: tokens.shadow.med,
                },
            ],
        },

        title: {
            color: tokens.text.primary,
            fontSize: fontSize.xl,
            fontWeight: '600',
            marginBottom: spacing.l,
        },

        description: {
            color: tokens.text.secondary,
            marginBottom: spacing.l,
            fontSize: fontSize.m,
            lineHeight: 21,
        },

        buttonContainer: {
            flexDirection: 'row',
            columnGap: spacing.xl2,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },

    })
}
