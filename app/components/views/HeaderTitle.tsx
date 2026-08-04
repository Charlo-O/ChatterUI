import { Stack } from 'expo-router'
import { ReactNode } from 'react'

import { useI18n } from '@lib/i18n'

type HeaderTitleProps = {
    title?: string
    headerTitle?: ((props: { children: string; tintColor?: string }) => ReactNode) | undefined
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title = '', headerTitle = undefined }) => {
    const { t } = useI18n()
    return (
        <Stack.Screen
            options={{
                title: title ? t(title) : title,
                headerTitle: headerTitle,
                animation: 'simple_push',
            }}
        />
    )
}

export default HeaderTitle
