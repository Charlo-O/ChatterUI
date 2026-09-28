import { AntDesign } from '@expo/vector-icons'
import { Href, useRouter } from 'expo-router'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'
import TText from '@components/text/TText'
import Drawer from '@components/views/Drawer'
import { AppSettings } from '@lib/constants/GlobalValues'
import { useAppMode } from '@lib/state/AppMode'

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
    const setShow = Drawer.useDrawerStore((state) => state.setShow)
    return (
        <View key={index}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.name}
                style={({ pressed }) => [styles.largeButton, { opacity: pressed ? 0.72 : 1 }]}
                onPress={() => {
                    setShow(Drawer.ID.SETTINGS, false)
                    router.push(item.path)
                }}>
                <AntDesign
                    size={18}
                    name={item.icon ?? 'question'}
                    color={styles.largeButtonText.color}
                />
                <TText style={styles.largeButtonText}>{item.name}</TText>
            </Pressable>
        </View>
    )
}

const RouteList = () => {
    const [devMode] = useMMKVBoolean(AppSettings.DevMode)
    const { appMode } = useAppMode()
    const paths = getPaths(appMode === 'remote')
    return (
        <FlatList
            contentContainerStyle={{ paddingHorizontal: 8, rowGap: 2 }}
            showsVerticalScrollIndicator={false}
            data={__DEV__ || devMode ? [...paths, ...paths_dev] : paths}
            renderItem={({ item, index }) => <DrawerButton item={item} index={index} />}
            keyExtractor={(item) => item.path.toString()}
        />
    )
}

export default RouteList

const useStyles = () => {
    const tokens = useAstryxTokens()
    return StyleSheet.create({
        largeButtonText: {
            fontSize: 14,
            color: tokens.text.secondary,
            fontWeight: '500',
        },

        largeButton: {
            minHeight: 40,
            paddingHorizontal: tokens.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: tokens.spacing.lg,
            borderRadius: tokens.radius.inner,
        },
    })
}

const getPaths = (remote: boolean): ButtonData[] => [
    {
        name: 'Sampler',
        path: '/screens/SamplerManagerScreen',
        icon: 'control',
    },
    {
        name: 'Formatting',
        path: '/screens/FormattingManagerScreen',
        icon: 'profile',
    },
    remote
        ? {
              name: 'API',
              path: '/screens/ConnectionsManagerScreen',
              icon: 'link',
          }
        : {
              name: 'Models',
              path: '/screens/ModelManagerScreen',
              icon: 'branches',
          },
    {
        name: 'TTS',
        path: '/screens/TTSManagerScreen',
        icon: 'sound',
    },
    {
        name: 'Logs',
        path: '/screens/LogsScreen',
        icon: 'code',
    },
    {
        name: 'About',
        path: '/screens/AboutScreen',
        icon: 'info-circle',
    },
    {
        name: 'Settings',
        path: '/screens/AppSettingsScreen',
        icon: 'setting',
    },
]

const paths_dev: ButtonData[] = [
    /*{
        name: '[DEV] HF',
        path: '/HFTest',
    },*/
    {
        name: '[DEV] Components',
        path: '/screens/ComponentTestScreen',
    },
    {
        name: '[DEV] ColorTest',
        path: '/screens/ColorTestScreen',
    },
    {
        name: '[DEV] Markdown',
        path: '/screens/MarkdownTestScreen',
    },
]
