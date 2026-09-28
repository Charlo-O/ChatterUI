import { useRouter } from 'expo-router'
import { Pressable, Text } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import GlassPortrait from '@components/liquid/GlassPortrait'
import Drawer from '@components/views/Drawer'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

const UserInfo = () => {
    const router = useRouter()
    const setShow = Drawer.useDrawerStore((state) => state.setShow)
    const { spacing, fontSize } = Theme.useTheme()
    const tokens = useAstryxTokens()
    const { userName, imageID } = Characters.useUserStore(
        useShallow((state) => ({
            userName: state.card?.name,
            imageID: state.card?.image_id ?? 0,
        }))
    )
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open user profile"
            onPress={() => {
                setShow(Drawer.ID.SETTINGS, false)
                router.push('/screens/UserManagerScreen')
            }}
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                columnGap: spacing.l,
                padding: spacing.xl,
                borderRadius: 24,
                backgroundColor: tokens.background.surface,
                marginHorizontal: spacing.l,
                marginBottom: spacing.m,
            }}>
            <GlassPortrait image={Characters.getImageDir(imageID)} size={48} />

            <Text style={{ fontSize: fontSize.l, color: tokens.text.primary, fontWeight: '600' }}>
                {userName}
            </Text>
        </Pressable>
    )
}

export default UserInfo
