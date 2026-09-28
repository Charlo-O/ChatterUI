import { AntDesign } from '@expo/vector-icons'
import { randomUUID } from 'expo-crypto'
import { useFocusEffect } from 'expo-router'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
    BackHandler,
    Dimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    Pressable,
    StyleSheet,
    StyleProp,
    TextStyle,
    View,
    ViewProps,
    ViewStyle,
    AccessibilityState,
} from 'react-native'
import Animated, {
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import {
    ExpandHeightIn,
    ExpandHeightUpIn,
    ShrinkHeightOut,
    ShrinkHeightUpOut,
} from '@lib/animations/transitions'
import TText from '@components/text/TText'
import { useContextMenuStore } from '@lib/state/components/ContextMenu'
import { Theme } from '@lib/theme/ThemeManager'

import Portal from './Portal'

export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center'

export type ContextMenuButtonProps = {
    key?: string
    label: string
    onPress?: (close: () => void) => void
    submenu?: ContextMenuButtonProps[]
    icon?: keyof typeof AntDesign.glyphMap
    iconSize?: number
    textColor?: string
    variant?: 'normal' | 'warning'
    disabled?: boolean
}

export interface ContextMenuProps extends ViewProps {
    triggerIcon?: keyof typeof AntDesign.glyphMap
    triggerIconSize?: number
    triggerStyle?: TextStyle
    buttons: ContextMenuButtonProps[]
    placement?: Placement
    disabled?: boolean
    onPress?: () => void
    onLongPress?: () => void
    delayLongPress?: number
    longPress?: boolean
    trigger?: ReactNode
    /** Accessible name for an icon-only default/custom trigger. */
    triggerAccessibilityLabel?: string
}

const CONTEXT_MENU_MIN_WIDTH = 128
const OFFSET = 8

const ContextMenu: React.FC<ContextMenuProps> = ({
    buttons,
    children,
    placement = 'auto',
    triggerIcon = 'question-circle',
    triggerIconSize = 26,
    triggerStyle,
    disabled,
    onPress,
    onLongPress,
    delayLongPress,
    longPress,
    trigger,
    triggerAccessibilityLabel,
}) => {
    const [idRef] = useState(() => `context-menu-${randomUUID()}`)
    const triggerRef = useRef<View>(null)
    const styles = useStyles()

    const { isOpen, openMenu, closeMenu } = useContextMenuStore(
        useShallow((state) => ({
            isOpen: state.openMenuId === idRef,
            openMenu: state.openMenu,
            closeMenu: state.closeMenu,
        }))
    )

    const [anchor, setAnchor] = useState<LayoutRectangle | null>(null)
    const setTriggerRef = useCallback((node: View | null) => {
        triggerRef.current = node
    }, [])

    const handleOpen = (event: GestureResponderEvent) => {
        const ne = event.nativeEvent

        if (!Number.isFinite(ne.pageX) || !Number.isFinite(ne.pageY) || (ne.pageX === 0 && ne.pageY === 0)) {
            triggerRef.current?.measureInWindow((x, y, width, height) => {
                setAnchor({ x: x + width / 2, y: y + height / 2, width: 0, height: 0 })
                openMenu(idRef)
            })
            return
        }

        setAnchor({
            x: ne.pageX,
            y: ne.pageY,
            width: 0,
            height: 0,
        })

        openMenu(idRef)
    }

    const handleCloseMenu = useCallback(() => {
        closeMenu()
    }, [closeMenu])

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                if (isOpen) {
                    handleCloseMenu()
                    return true
                }
                return false
            }
            const handler = BackHandler.addEventListener('hardwareBackPress', backAction)
            return () => handler.remove()
        }, [handleCloseMenu, isOpen])
    )

    type TriggerProps = {
        label?: string
        accessibilityRole?: 'button' | string
        accessibilityLabel?: string
        accessibilityState?: AccessibilityState
        ref?: React.Ref<View>
        disabled?: boolean
        onPressIn?: (event: GestureResponderEvent) => void
        onPress?: (event: GestureResponderEvent) => void
        onLongPress?: (event: GestureResponderEvent) => void
        delayLongPress?: number
        style?: StyleProp<ViewStyle>
    }
    const triggerElement = React.isValidElement<TriggerProps>(trigger) ? trigger : null
    const wrappedTrigger = triggerElement
        ? (
              <View ref={setTriggerRef} collapsable={false}>
                  {/* The trigger is cloned to preserve its visual component while adding menu handlers. */}
                  {/* eslint-disable-next-line react-compiler/react-compiler */}
                  {React.cloneElement(triggerElement, {
                      accessibilityRole: 'button',
                      accessibilityLabel:
                          triggerAccessibilityLabel ??
                          triggerElement.props.accessibilityLabel ??
                          triggerElement.props.label ??
                          'Open menu',
                      accessibilityState: {
                          ...(triggerElement.props.accessibilityState ?? {}),
                          expanded: isOpen,
                          disabled,
                      },
                      disabled: disabled ?? triggerElement.props.disabled,
                      onPressIn: (event: GestureResponderEvent) => {
                          triggerElement.props.onPressIn?.(event)
                          if (!longPress) handleOpen(event)
                      },
                      onPress: (event: GestureResponderEvent) => {
                          triggerElement.props.onPress?.(event)
                          onPress?.()
                      },
                      delayLongPress: delayLongPress ?? 300,
                      onLongPress: (event: GestureResponderEvent) => {
                          triggerElement.props.onLongPress?.(event)
                          onLongPress?.()
                          if (longPress) handleOpen(event)
                      },
                      style: [triggerElement.props.style, { opacity: isOpen ? 0.5 : 1 }],
                  })}
              </View>
          )
        : null

    return (
        <>
            {wrappedTrigger ?? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={triggerAccessibilityLabel ?? 'Open menu'}
                    accessibilityState={{ expanded: isOpen, disabled }}
                    style={({ pressed }) => ({ opacity: isOpen ? 0.5 : pressed ? 0.72 : 1 })}
                    ref={setTriggerRef}
                    onPressIn={(event) => {
                        if (longPress) return
                        handleOpen(event)
                    }}
                    onPress={() => onPress?.()}
                    delayLongPress={delayLongPress ?? 300}
                    onLongPress={(event) => {
                        onLongPress?.()
                        if (!longPress) return
                        handleOpen(event)
                    }}
                    disabled={disabled}>
                    {children || (
                        <AntDesign
                            size={triggerIconSize}
                            style={[styles.menuText, triggerStyle]}
                            name={triggerIcon}
                        />
                    )}
                </Pressable>
            )}

            {isOpen && anchor && (
                <Portal name={idRef}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleCloseMenu}>
                        <MenuContent
                            anchor={anchor}
                            placement={placement}
                            buttons={buttons}
                            onClose={handleCloseMenu}
                        />
                    </Pressable>
                </Portal>
            )}
        </>
    )
}

function computePosition(
    anchor: LayoutRectangle,
    placement: Placement,
    width: number,
    height: number,
    safe: { top: number; bottom: number; left: number; right: number }
) {
    let top = 0
    let left = 0

    switch (placement) {
        case 'right':
            top = anchor.y + OFFSET
            left = anchor.x + OFFSET
            break

        case 'left':
            top = anchor.y + OFFSET
            left = anchor.x - width - OFFSET
            break

        case 'bottom':
            top = anchor.y + OFFSET
            left = anchor.x - width / 2
            break

        case 'top':
            top = anchor.y - height - OFFSET
            left = anchor.x - width / 2
            break

        case 'center':
            top = anchor.y - height / 2
            left = anchor.x - width / 2
            break

        case 'auto':
        default: {
            const fitsRight = anchor.x + width <= safe.right
            const fitsLeft = anchor.x - width >= safe.left

            if (fitsRight) {
                top = anchor.y + OFFSET
                left = anchor.x + OFFSET
            } else if (fitsLeft) {
                top = anchor.y + OFFSET
                left = anchor.x - width - OFFSET
            } else {
                top = anchor.y - height - OFFSET
                left = anchor.x - width / 2
            }
        }
    }

    const clampedLeft = Math.max(safe.left, Math.min(left, safe.right - width))
    const clampedTop = Math.max(safe.top, Math.min(top, safe.bottom - height))

    return { top: clampedTop, left: clampedLeft }
}

const MenuContent = ({
    anchor,
    placement,
    buttons,
    onClose,
}: {
    anchor: LayoutRectangle
    placement: Placement
    buttons: ContextMenuButtonProps[]
    onClose: () => void
}) => {
    const styles = useStyles()
    const insets = useSafeAreaInsets()

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

    const [menuSize, setMenuSize] = useState({ width: 0, height: 0 })

    const topSV = useSharedValue(0)
    const leftSV = useSharedValue(0)

    const initial = useRef(true)

    useEffect(() => {
        const safeBounds = {
            top: insets.top + OFFSET,
            bottom: screenHeight - insets.bottom - OFFSET,
            left: insets.left + OFFSET,
            right: screenWidth - insets.right - OFFSET,
        }

        const { width, height } = menuSize
        if (width === 0 || height === 0) return

        const { top, left } = computePosition(anchor, placement, width, height, safeBounds)

        const duration = initial.current ? 0 : 200

        topSV.value = withTiming(top, { duration })
        leftSV.value = withTiming(left, { duration })

        if (initial.current) initial.current = false
    }, [menuSize, anchor, placement, topSV, leftSV, insets, screenHeight, screenWidth])

    const animatedStyle = useAnimatedStyle(() => ({
        top: topSV.value,
        left: leftSV.value,
    }))

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout

        setMenuSize((prev) => {
            if (Math.abs(prev.width - width) < 2 && Math.abs(prev.height - height) < 2) {
                return prev
            }
            return { width, height }
        })
    }, [])

    return (
        <Animated.View style={[styles.menuContainer, animatedStyle]}>
            <View onLayout={handleLayout}>
                <MenuList buttons={buttons} onClose={onClose} placement={placement} />
            </View>
        </Animated.View>
    )
}

const MenuList = ({
    buttons,
    onClose,
    placement,
}: {
    buttons: ContextMenuButtonProps[]
    onClose: () => void
    placement?: Placement
}) => {
    const styles = useStyles()
    const [openKey, setOpenKey] = useState<string | null>(null)

    return (
        <Animated.View
            layout={LinearTransition}
            entering={placement === 'top' ? ExpandHeightUpIn : ExpandHeightIn}
            exiting={placement === 'top' ? ShrinkHeightUpOut : ShrinkHeightOut}
            style={styles.menu}>
            {buttons
                .filter((b) => !b.disabled)
                .map((item, index) => {
                    const key = item.key ?? `${index}`
                    const hasSubmenu = !!item.submenu

                    return (
                        <Animated.View key={key} layout={LinearTransition}>
                            <Pressable
                                accessibilityRole="menuitem"
                                accessibilityState={{ disabled: item.disabled }}
                                accessibilityLabel={item.label}
                                style={styles.menuItem}
                                onPress={() => {
                                    if (hasSubmenu) {
                                        setOpenKey(openKey === key ? null : key)
                                    } else {
                                        item.onPress?.(onClose)
                                    }
                                }}>
                                {item.icon && (
                                    <AntDesign
                                        name={item.icon}
                                        size={item.iconSize ?? 18}
                                        style={
                                            item.variant === 'warning'
                                                ? styles.menuTextError
                                                : styles.menuText
                                        }
                                    />
                                )}

                                {!item.icon && hasSubmenu && (
                                    <AntDesign
                                        name={openKey === key ? 'caret-up' : 'caret-down'}
                                        size={12}
                                        style={styles.menuText}
                                    />
                                )}

                                <TText
                                    style={
                                        item.variant === 'warning'
                                            ? styles.menuTextError
                                            : styles.menuText
                                    }>
                                    {item.label}
                                </TText>
                            </Pressable>

                            {hasSubmenu && openKey === key && (
                                <MenuList buttons={item.submenu!} onClose={onClose} />
                            )}
                        </Animated.View>
                    )
                })}
        </Animated.View>
    )
}

const useStyles = () => {
    const { astryx } = Theme.useTheme()
    return StyleSheet.create({
        menuContainer: {
            position: 'absolute',
            borderRadius: astryx.radius.element,
        },
        menu: {
            backgroundColor: astryx.background.popover,
            minWidth: CONTEXT_MENU_MIN_WIDTH,
            borderColor: astryx.border.default,
            borderWidth: 1,
            padding: 6,
            borderRadius: astryx.radius.element,
            overflow: 'hidden',
            boxShadow: [
                {
                    offsetX: 0,
                    offsetY: 8,
                    blurRadius: 24,
                    color: astryx.shadow.med,
                },
            ],
        },
        menuItem: {
            paddingVertical: 11,
            paddingHorizontal: 12,
            paddingRight: 24,
            minWidth: CONTEXT_MENU_MIN_WIDTH,
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 12,
            borderRadius: astryx.radius.inner,
        },
        menuText: {
            color: astryx.text.primary,
        },
        menuTextError: {
            color: astryx.status.error,
        },
    })
}

export default ContextMenu
