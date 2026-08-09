import { useRouter } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import Avatar from '@components/views/Avatar'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'

const UserInfo = () => {
    const router = useRouter()
    const { color, spacing, borderWidth, borderRadius, fontSize } = Theme.useTheme()
    const { userName, imageID } = Characters.useUserStore(
        useShallow((state) => ({
            userName: state.card?.name,
            imageID: state.card?.image_id ?? 0,
        }))
    )
    return (
        <TouchableOpacity
            onPress={() => {
                router.push('/screens/UserManagerScreen')
            }}
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                columnGap: spacing.l,
                padding: spacing.xl,
                borderBottomColor: color.neutral._400,
                borderBottomWidth: 1,
            }}>
            <Avatar
                targetImage={Characters.getImageDir(imageID)}
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: borderRadius.l,
                    borderColor: color.neutral._400,
                    borderWidth: borderWidth.s,
                }}
            />

            <Text style={{ fontSize: fontSize.l, color: color.text._100, fontWeight: '600' }}>
                {userName}
            </Text>
        </TouchableOpacity>
    )
}

export default UserInfo
