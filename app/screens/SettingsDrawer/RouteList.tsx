import { AntDesign } from '@expo/vector-icons'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useTranslation } from '@lib/hooks/useTranslation'
import { useAppMode } from '@lib/state/AppMode'
import { Theme } from '@lib/theme/ThemeManager'
import { Href, useRouter } from 'expo-router'
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import Animated, { Easing, SlideInLeft } from 'react-native-reanimated'

type ButtonData = {
    name: string
    path: Href
    icon?: keyof typeof AntDesign.glyphMap
}

type DrawerButtonProps = {
    item: ButtonData
    index: number
}

const DrawerButton = ({ item, index }: DrawerButtonProps) => {
    const styles = useStyles()
    const router = useRouter()
    const { color } = Theme.useTheme()
    return (
        <Animated.View
            key={index}
            entering={SlideInLeft.duration(500 + index * 30)
                .withInitialValues({ originX: index * -150 + -400 })
                .easing(Easing.out(Easing.exp))}>
            <TouchableOpacity
                style={styles.largeButton}
                onPress={() => {
                    router.push(item.path)
                }}>
                <AntDesign size={24} name={item.icon ?? 'question'} color={color.text._400} />
                <Text style={styles.largeButtonText}>{item.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const RouteList = () => {
    const [devMode, _] = useMMKVBoolean(AppSettings.DevMode)
    const { appMode } = useAppMode()
    const { t } = useTranslation()
    const paths = getPaths(appMode === 'remote', t)
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={__DEV__ || devMode ? [...paths, ...getDevPaths(t)] : paths}
            renderItem={({ item, index }) => <DrawerButton item={item} index={index} />}
            keyExtractor={(item) => item.path.toString()}
        />
    )
}

export default RouteList

const useStyles = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    return StyleSheet.create({
        largeButtonText: {
            fontSize: fontSize.xl,
            paddingVertical: spacing.l,
            paddingLeft: spacing.xl,
            color: color.text._100,
        },

        largeButton: {
            paddingLeft: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
        },
    })
}

const getPaths = (remote: boolean, t: any): ButtonData[] => [
    {
        name: t('menu.sampler'),
        path: '/SamplerMenu',
        icon: 'barschart',
    },
    {
        name: t('menu.formatting'),
        path: '/screens/FormattingManager',
        icon: 'profile',
    },
    remote
        ? {
              name: t('menu.api'),
              path: '/screens/APIManager',
              icon: 'link',
          }
        : {
              name: t('menu.models'),
              path: '/screens/ModelManager',
              icon: 'folderopen',
          },
    {
        name: t('menu.tts'),
        path: '/screens/TTSMenu',
        icon: 'sound',
    },
    {
        name: t('menu.logs'),
        path: '/Logs',
        icon: 'codesquareo',
    },
    {
        name: t('menu.about'),
        path: '/About',
        icon: 'infocirlceo',
    },
    {
        name: t('menu.settings'),
        path: '/screens/AppSettingsMenu',
        icon: 'setting',
    },
]

const getDevPaths = (t: any): ButtonData[] => [
    {
        name: t('dev.components'),
        path: '/ComponentTest',
    },
    {
        name: t('dev.colorTest'),
        path: '/ColorTest',
    },
    {
        name: t('dev.markdown'),
        path: '/screens/MarkdownTest',
    },
]
