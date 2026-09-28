import { AntDesign } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { ComponentProps, ReactNode, useCallback } from 'react'
import { BackHandler, StyleSheet, View, ViewStyle } from 'react-native'
import { FlingGesture, GestureDetector, Gesture as GS } from 'react-native-gesture-handler'
import Animated, {
    ComplexAnimationBuilder,
    Easing,
    SlideInDown,
    SlideInLeft,
    SlideInRight,
    SlideInUp,
    SlideOutDown,
    SlideOutLeft,
    SlideOutRight,
    SlideOutUp,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

import ThemedButton, { ThemedButtonProps } from '@components/buttons/ThemedButton'
import GlassSurface from '@components/liquid/GlassSurface'
import { Theme } from '@lib/theme/ThemeManager'

import FadeBackrop from './FadeBackdrop'

type Direction = 'left' | 'right' | 'up' | 'down'

const animationIn: Record<Direction, ComplexAnimationBuilder> = {
    left: SlideInLeft.duration(220).easing(Easing.out(Easing.exp)),
    right: SlideInRight.duration(220).easing(Easing.out(Easing.exp)),
    up: SlideInUp.duration(220).easing(Easing.out(Easing.exp)),
    down: SlideInDown.duration(220).easing(Easing.out(Easing.exp)),
}

const animationOut: Record<Direction, ComplexAnimationBuilder> = {
    left: SlideOutLeft.duration(220).easing(Easing.out(Easing.exp)),
    right: SlideOutRight.duration(220).easing(Easing.out(Easing.exp)),
    up: SlideOutUp.duration(220).easing(Easing.out(Easing.exp)),
    down: SlideOutDown.duration(220).easing(Easing.out(Easing.exp)),
}

type DrawerBodyProps = {
    drawerID: Drawer.ID
    direction?: Direction
    drawerStyle?: ViewStyle
    children?: ReactNode
}

interface DrawerButtonProps extends ThemedButtonProps {
    drawerID: Drawer.ID
    openIcon?: keyof typeof AntDesign.glyphMap
    closeIcon?: keyof typeof AntDesign.glyphMap
}

type DrawerGestureConfig = {
    drawerID: Drawer.ID
    closeDirection: Direction
    openDirection: Direction
}

const DirectionToGestureMap: Record<Direction, number> = {
    left: 2,
    right: 1,
    up: 4,
    down: 8,
}

interface DrawerGestureProps extends Omit<ComponentProps<typeof GestureDetector>, 'gesture'> {
    config: DrawerGestureConfig[]
}

type DrawerStateProps = {
    values: Record<string, boolean>
    setShow: (key: string, value: boolean) => void
}

namespace Drawer {
    export enum ID {
        SETTINGS = 'settings',
        CHATLIST = 'chats',
        USERLIST = 'userlist',
    }

    export const Body: React.FC<DrawerBodyProps> = ({
        drawerID: drawerId,
        direction = 'left',
        drawerStyle = {},
        children = undefined,
    }) => {
        const styles = useStyles()
        const insets = useSafeAreaInsets()
        const { setShow, show } = useDrawerStore(
            useShallow((state) => ({
                setShow: state.setShow,
                show: state.values?.[drawerId],
            }))
        )
        const handleOverlayClick = () => setShow(drawerId, false)

        useFocusEffect(
            useCallback(() => {
                const backAction = () => {
                    if (show) {
                        setShow(drawerId, false)
                        return true
                    }
                    return false
                }
                const handler = BackHandler.addEventListener('hardwareBackPress', backAction)
                return () => handler.remove()
            }, [drawerId, setShow, show])
        )
        if (!show) return

        return (
            <View style={styles.absolute} accessibilityViewIsModal>
                <FadeBackrop handleOverlayClick={handleOverlayClick} />
                <Animated.View
                    style={{
                        ...styles.drawer,
                        ...drawerStyle,
                        paddingTop: (typeof drawerStyle.paddingTop === 'number' ? drawerStyle.paddingTop : 16) + insets.top,
                        paddingBottom: insets.bottom + 16,
                    }}
                    entering={animationIn[direction]}
                    exiting={animationOut[direction]}>
                    <GlassSurface pointerEvents="none" style={StyleSheet.absoluteFill} />
                    {children}
                </Animated.View>
            </View>
        )
    }

    export const Button: React.FC<DrawerButtonProps> = ({
        drawerID: drawerId,
        openIcon = 'menu-fold',
        closeIcon = 'close',
        ...rest
    }) => {
        const { setShow, show } = useDrawerStore(
            useShallow((state) => ({
                setShow: state.setShow,
                show: state.values?.[drawerId],
            }))
        )
        return (
            <ThemedButton
                accessibilityLabel={show ? 'Close navigation' : 'Open navigation'}
                iconSize={24}
                onPress={() => {
                    setShow(drawerId, !show)
                }}
                variant="tertiary"
                iconName={show ? closeIcon : openIcon}
                {...rest}
            />
        )
    }

    export const Gesture: React.FC<DrawerGestureProps> = ({ config, ...rest }) => {
        const { setShowDrawer, values } = Drawer.useDrawerStore(
            useShallow((state) => ({
                setShowDrawer: state.setShow,
                values: state.values,
            }))
        )

        const drawerShown = config.map((item) => values?.[item.drawerID]).some((item) => item)

        const gestures: FlingGesture[] = []
        config.forEach((item) => {
            gestures.push(
                GS.Fling()
                    .direction(DirectionToGestureMap[item.closeDirection])
                    .onEnd(() => {
                        setShowDrawer(item.drawerID, false)
                    })
                    .runOnJS(true)
                    .enabled(values?.[item.drawerID])
            )

            gestures.push(
                GS.Fling()
                    .direction(DirectionToGestureMap[item.openDirection])
                    .onEnd(() => {
                        setShowDrawer(item.drawerID, true)
                    })
                    .runOnJS(true)
                    .enabled(!drawerShown)
            )
        })
        const gesture = GS.Simultaneous(...gestures)

        return <GestureDetector {...rest} gesture={gesture} />
    }

    export const useDrawerStore = create<DrawerStateProps>((set) => ({
        values: {},
        setShow: (key, value) =>
            set((state) => ({
                values: { ...state.values, [key]: value },
            })),
    }))
}

export default Drawer

const useStyles = () => {
    const { color, astryx } = Theme.useTheme()
    return StyleSheet.create({
        absolute: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
        },

        drawer: {
            backgroundColor: 'transparent',
            shadowColor: color.shadow,
            width: '80%',
            maxWidth: 420,
            height: '100%',
            borderRadius: 28,
            overflow: 'hidden',
            borderRightColor: astryx.border.default,
            borderWidth: 1,
            borderColor: astryx.border.default,
            elevation: 16,
            zIndex: 2,
            position: 'absolute',
            paddingTop: 8,
        },
    })
}
