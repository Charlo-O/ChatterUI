import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, Modal, Platform, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton from '@components/buttons/ThemedButton'
import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import TText from '@components/text/TText'
import Avatar from '@components/views/Avatar'
import FadeBackrop from '@components/views/FadeBackdrop'
import { Characters } from '@lib/state/Characters'
import { useAvatarViewerStore } from '@lib/state/components/AvatarViewer'

type AvatarViewerProps = {
    editorButton?: boolean
}

const AvatarViewer: React.FC<AvatarViewerProps> = ({ editorButton = true }) => {
    const router = useRouter()
    const styles = useStyles()

    const { show, setShow, isUser } = useAvatarViewerStore(
        useShallow((state) => ({
            show: state.showViewer,
            setShow: state.setShow,
            isUser: state.isUser,
        }))
    )

    const { charName, charImageId } = Characters.useCharacterStore(
        useShallow((state) => ({
            charName: state.card?.name,
            charImageId: state.card?.image_id,
        }))
    )

    const { userName, userImageId } = Characters.useUserStore(
        useShallow((state) => ({
            userName: state.card?.name,
            userImageId: state.card?.image_id,
        }))
    )

    const [aspectRatio, setAspectRatio] = useState(1)

    const imageId = isUser ? userImageId : charImageId

    const name = isUser ? userName : charName

    useEffect(() => {
        const imageURI = Characters.getImageDir(imageId ?? -1)
        if (Platform.OS === 'web' && imageURI.startsWith('web://')) {
            setAspectRatio(1)
            return
        }
        Image.getSize(
            imageURI,
            (width, height) => {
                setAspectRatio(width / height)
            },
            () => {
                setAspectRatio(1)
            }
        )
    }, [imageId])

    return (
        <Modal
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            style={styles.modal}
            animationType="fade"
            visible={show}
            onRequestClose={() => setShow(false)}>
            <FadeBackrop handleOverlayClick={() => setShow(false)} />
            <View style={styles.mainContainer}>
                <Animated.View
                    accessible
                    accessibilityViewIsModal
                    accessibilityLabel={name ?? 'Avatar preview'}
                    style={styles.bodyContainer}
                    entering={FadeInDown}>
                    <Avatar
                        contentFit="cover"
                        targetImage={Characters.getImageDir(imageId ?? -1)}
                        style={[styles.avatar, { aspectRatio: aspectRatio }]}
                    />
                    <TText style={styles.name}>{name}</TText>
                    <View style={styles.buttonContainer}>
                        {editorButton && (
                            <ThemedButton
                                label="Edit Character"
                                iconName="edit"
                                iconSize={18}
                                variant="primary"
                                onPress={() => {
                                    router.push(
                                        isUser
                                            ? '/screens/UserManagerScreen'
                                            : '/screens/CharacterEditorScreen'
                                    )
                                    setShow(false)
                                }}
                            />
                        )}

                        <ThemedButton
                            label="Close"
                            iconName="close"
                            iconSize={18}
                            variant="ghost"
                            onPress={() => {
                                setShow(false)
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}

export default AvatarViewer

const useStyles = () => {
    const tokens = useAstryxTokens()
    return StyleSheet.create({
        modal: {
            flex: 1,
        },

        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        bodyContainer: {
            shadowColor: tokens.shadow.high,
            elevation: 10,
            paddingTop: tokens.spacing.xxl,
            paddingBottom: tokens.spacing.xl,
            paddingHorizontal: tokens.spacing.xxl,
            backgroundColor: tokens.background.surface,
            borderColor: tokens.border.default,
            borderWidth: 1,
            borderRadius: tokens.radius.container,
            alignItems: 'center',
        },

        avatar: {
            height: undefined,
            width: '70%',
            borderRadius: tokens.radius.element,
            borderWidth: 2,
            borderColor: tokens.brand.primary,
        },

        name: {
            marginTop: tokens.spacing.md,
            fontSize: 20,
            fontWeight: '500',
            color: tokens.text.primary,
        },

        buttonContainer: {
            marginTop: tokens.spacing.xl,
            flexDirection: 'row',
            columnGap: tokens.spacing.md,
        },
    })
}
