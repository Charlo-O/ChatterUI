import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { ReactNode } from 'react'
import {
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import GlassSurface from '@components/liquid/GlassSurface'
import Drawer from '@components/views/Drawer'
import HeaderTitle from '@components/views/HeaderTitle'
import { Theme } from '@lib/theme/ThemeManager'

import { AstryxButton, AstryxIconButton, useAstryxTokens } from './AstryxPrimitives'

export const AstryxMark = ({ size = 24 }: { size?: number }) => {
    const tokens = useAstryxTokens()
    const unit = size * 0.34
    const gap = size * 0.08
    return (
        <View accessible accessibilityLabel="ChatterUI" style={{ width: size, height: size }}>
            <View
                style={[
                    styles.markBlock,
                    {
                        width: unit,
                        height: unit,
                        left: 0,
                        top: 0,
                        backgroundColor: tokens.brand.primary,
                    },
                ]}
            />
            <View
                style={[
                    styles.markBlock,
                    {
                        width: unit,
                        height: unit,
                        right: 0,
                        top: 0,
                        backgroundColor: tokens.brand.primary,
                    },
                ]}
            />
            <View
                style={[
                    styles.markBlock,
                    {
                        width: unit,
                        height: unit,
                        left: 0,
                        bottom: 0,
                        backgroundColor: tokens.brand.primary,
                    },
                ]}
            />
            <View
                style={[
                    styles.markBlock,
                    {
                        width: unit,
                        height: unit,
                        right: 0,
                        bottom: 0,
                        backgroundColor: tokens.brand.primary,
                    },
                ]}
            />
            <View
                style={[
                    styles.markCenter,
                    {
                        width: unit + gap,
                        height: unit + gap,
                        left: (size - unit - gap) / 2,
                        top: (size - unit - gap) / 2,
                        backgroundColor: tokens.brand.primary,
                    },
                ]}
            />
        </View>
    )
}

export const AstryxTopBar: React.FC<{
    title: string
    subtitle?: string
    onBack?: () => void
    onPrimary?: () => void
    primaryLabel?: string
    primaryIcon?: keyof typeof MaterialIcons.glyphMap
    onSearch?: () => void
    searchActive?: boolean
    actions?: ReactNode
    showMenu?: boolean
    style?: StyleProp<ViewStyle>
    leading?: ReactNode
    titleAccessory?: ReactNode
    onTitlePress?: () => void
}> = ({
    title,
    subtitle,
    onBack,
    onPrimary,
    primaryLabel,
    primaryIcon = 'add',
    onSearch,
    searchActive,
    actions,
    showMenu = true,
    style,
    leading,
    titleAccessory,
    onTitlePress,
}) => {
    const tokens = useAstryxTokens()
    const insets = useSafeAreaInsets()
    return (
        <View
            style={[
                styles.topBar,
                {
                    paddingTop: Platform.OS === 'web' ? 14 : Math.max(insets.top, 10) + 8,
                    backgroundColor: tokens.background.body,
                },
                style,
            ]}>
            <View style={styles.topBarRow}>
                <View style={{ minWidth: 44 }}>
                    {leading ?? (
                        <>
                            {onBack && (
                                <GlassSurface interactive style={{ borderRadius: 999 }}>
                                    <AstryxIconButton
                                        iconName="left"
                                        iconSize={22}
                                        label="Go back"
                                        variant="ghost"
                                        onPress={onBack}
                                    />
                                </GlassSurface>
                            )}
                            {showMenu && !onBack && (
                                <GlassSurface interactive style={{ borderRadius: 999 }}>
                                    <Drawer.Button
                                        drawerID={Drawer.ID.SETTINGS}
                                        buttonStyle={{ width: 44, height: 44, padding: 0 }}
                                    />
                                </GlassSurface>
                            )}
                        </>
                    )}
                </View>
                <Pressable
                    disabled={!onTitlePress}
                    accessibilityRole={onTitlePress ? 'button' : 'header'}
                    accessibilityLabel={title}
                    onPress={onTitlePress}
                    style={styles.brandGroup}>
                    {titleAccessory}
                    <View style={styles.titleGroup}>
                        <Text
                            numberOfLines={1}
                            style={[styles.brandTitle, { color: tokens.text.primary }]}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                numberOfLines={1}
                                style={[styles.brandSubtitle, { color: tokens.text.secondary }]}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </Pressable>
                <View style={styles.topActions}>
                    {actions}
                    {onSearch && (
                        <AstryxIconButton
                            iconName={searchActive ? 'close' : 'search'}
                            label={searchActive ? 'Close search' : 'Search'}
                            variant="ghost"
                            onPress={onSearch}
                        />
                    )}
                    {onPrimary && primaryLabel && (
                        <AstryxButton
                            label={primaryLabel}
                            variant="primary"
                            icon={
                                <MaterialIcons
                                    name={primaryIcon}
                                    size={16}
                                    color={tokens.accent.onPrimary}
                                />
                            }
                            onPress={onPrimary}
                            style={styles.primaryAction}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export const AstryxSideNav: React.FC<{
    title?: string
    items: {
        label: string
        icon: keyof typeof MaterialIcons.glyphMap
        onPress: () => void
        selected?: boolean
    }[]
    footer?: ReactNode
}> = ({ title = 'Workspace', items, footer }) => {
    const tokens = useAstryxTokens()
    const { width } = useWindowDimensions()
    if (Platform.OS !== 'web' || width < 960) return null
    return (
        <View
            style={[
                styles.sideNav,
                {
                    backgroundColor: tokens.background.surface,
                    borderRightColor: tokens.border.default,
                },
            ]}>
            <Text style={[styles.sideNavTitle, { color: tokens.text.muted }]}>{title}</Text>
            {items.map((item) => (
                <Pressable
                    key={item.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: item.selected }}
                    onPress={item.onPress}
                    style={({ pressed }) => [
                        styles.sideNavItem,
                        {
                            backgroundColor: item.selected ? tokens.accent.muted : 'transparent',
                            opacity: pressed ? 0.72 : 1,
                        },
                    ]}>
                    <MaterialIcons
                        name={item.icon}
                        size={18}
                        color={item.selected ? tokens.accent.primary : tokens.text.secondary}
                    />
                    <Text
                        style={{
                            color: item.selected ? tokens.text.primary : tokens.text.secondary,
                            fontWeight: item.selected ? '600' : '500',
                        }}>
                        {item.label}
                    </Text>
                </Pressable>
            ))}
            {footer && <View style={styles.sideNavFooter}>{footer}</View>}
        </View>
    )
}

export const AstryxPage: React.FC<{ children: ReactNode; style?: StyleProp<ViewStyle> }> = ({
    children,
    style,
}) => {
    const tokens = useAstryxTokens()
    const { color } = Theme.useTheme()
    return (
        <View
            style={[
                styles.page,
                { backgroundColor: tokens.background.body ?? color.neutral._100 },
                style,
            ]}>
            {children}
        </View>
    )
}

/**
 * Shared route shell for secondary screens. It keeps Expo Router's native
 * header contract in place (hidden so it cannot compete with the Astryx bar)
 * while making the visual navigation and spacing consistent across screens.
 */
export const AstryxScreen: React.FC<{
    title: string
    subtitle?: string
    children: ReactNode
    actions?: ReactNode
    onBack?: () => void
    showMenu?: boolean
    onPrimary?: () => void
    primaryLabel?: string
    primaryIcon?: keyof typeof MaterialIcons.glyphMap
    style?: StyleProp<ViewStyle>
}> = ({
    title,
    subtitle,
    children,
    actions,
    onBack,
    showMenu = false,
    onPrimary,
    primaryLabel,
    primaryIcon,
    style,
}) => {
    const router = useRouter()
    // Secondary routes do not mount the settings drawer's gesture/body. A
    // default back affordance prevents a dead "Open navigation" control;
    // callers with a mounted drawer can opt into showMenu explicitly.
    const resolvedShowMenu = showMenu ?? false
    const resolvedOnBack =
        onBack ??
        (() => {
            if (router.canGoBack()) router.back()
            else router.replace('/')
        })
    return (
        <AstryxPage style={style}>
            <HeaderTitle title={title} headerShown={false} />
            <AstryxTopBar
                title={title}
                subtitle={subtitle}
                actions={actions}
                onBack={resolvedShowMenu ? onBack : resolvedOnBack}
                showMenu={resolvedShowMenu}
                onPrimary={onPrimary}
                primaryLabel={primaryLabel}
                primaryIcon={primaryIcon}
            />
            <View style={{ flex: 1 }}>{children}</View>
        </AstryxPage>
    )
}

const styles = StyleSheet.create({
    markBlock: { borderRadius: 4, position: 'absolute' },
    markCenter: { borderRadius: 4, position: 'absolute' },
    page: { flex: 1, minHeight: '100%' },
    topBar: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center',
    },
    topBarRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 52,
        gap: 12,
    },
    brandGroup: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        flex: 1,
        minWidth: 0,
    },
    titleGroup: { gap: 2, flexShrink: 1, alignItems: 'center' },
    brandTitle: { fontSize: 19, fontWeight: '600', letterSpacing: -0.4 },
    brandSubtitle: { fontSize: 12 },
    topActions: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        minWidth: 44,
        justifyContent: 'flex-end',
    },
    primaryAction: { minWidth: 36 },
    sideNav: {
        borderRightWidth: 0,
        borderRadius: 28,
        margin: 16,
        paddingHorizontal: 12,
        paddingTop: 20,
        width: 220,
    },
    sideNavTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
        marginBottom: 10,
        paddingHorizontal: 10,
        textTransform: 'uppercase',
    },
    sideNavItem: {
        alignItems: 'center',
        borderRadius: 22,
        flexDirection: 'row',
        gap: 10,
        minHeight: 44,
        paddingHorizontal: 10,
        marginBottom: 3,
    },
    sideNavFooter: { marginTop: 'auto', paddingBottom: 16, paddingTop: 20 },
})

// Expo Router scans files below `app/` as potential routes. A default export
// keeps this shared module explicit and prevents a noisy route warning while
// still allowing named shell primitives above.
export default AstryxPage
