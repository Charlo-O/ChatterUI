import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import TText from '@components/text/TText'
import { useAstryxTokens } from '@components/astryx/AstryxPrimitives'

import ThemedButton from './ThemedButton'

const enum ResponseStatus {
    DEFAULT,
    OK,
    ERROR,
}

type HeartbeatButtonProps = {
    api: string
    apiFormat?: (url: string) => string
    callback?: () => void
    messageNeutral?: string
    messageError?: string
    messageOK?: string
    headers?: any
}

const defaultApiFormat = (url: string) => {
    try {
        return new URL('v1/models', url).toString()
    } catch {
        return ''
    }
}

const noop = () => {}

const HeartbeatButton: React.FC<HeartbeatButtonProps> = ({
    api,
    apiFormat = defaultApiFormat,
    messageNeutral = 'Not Connected',
    messageError = 'Failed To Connect',
    messageOK = 'Connected',
    headers,
    callback = noop,
}) => {
    const tokens = useAstryxTokens()
    const [status, setStatus] = useState<ResponseStatus>(ResponseStatus.DEFAULT)
    const [checking, setChecking] = useState(false)
    const autoCheckedApi = useRef<string | null>(null)

    const StatusMessage = () => {
        switch (status) {
            case ResponseStatus.DEFAULT:
                return messageNeutral
            case ResponseStatus.ERROR:
                return messageError
            case ResponseStatus.OK:
                return messageOK
        }
    }

    const handleCheck = useCallback(async () => {
        const endpoint = apiFormat(api)
        setChecking(true)
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => {
                controller.abort()
            }, 1000)
            const response = await fetch(endpoint, {
                method: 'GET',
                signal: controller.signal,
                headers: headers ?? {},
            }).catch(() => ({ status: 400 }))
            clearTimeout(timeout)
            callback()
            setStatus(response.status === 200 ? ResponseStatus.OK : ResponseStatus.ERROR)
        } catch {
            setStatus(ResponseStatus.ERROR)
        } finally {
            setChecking(false)
        }
    }, [api, apiFormat, callback, headers])

    useEffect(() => {
        if (autoCheckedApi.current === api) return
        autoCheckedApi.current = api
        void handleCheck()
    }, [handleCheck])

    const isDark = tokens.dark
    const statusPalette =
        status === ResponseStatus.ERROR
            ? {
                  background: isDark ? 'rgba(255, 152, 144, 0.24)' : '#FEE4E6',
                  foreground: isDark ? '#FFC4BE' : tokens.status.error,
              }
            : status === ResponseStatus.OK
              ? {
                    background: isDark ? 'rgba(57, 221, 137, 0.18)' : '#D6FEE4',
                    foreground: tokens.status.success,
                }
              : {
                    background: tokens.background.muted,
                    foreground: tokens.text.secondary,
                }

    return (
        <View style={[styles.row, { marginTop: tokens.spacing.sm }]}>
            <ThemedButton
                label="Test"
                onPress={handleCheck}
                variant="secondary"
                loading={checking}
                accessibilityHint="Test the API connection"
            />
            <View
                accessibilityRole="text"
                accessibilityLiveRegion="polite"
                style={[
                    styles.status,
                    {
                        marginLeft: tokens.spacing.xs,
                        backgroundColor: statusPalette.background,
                        borderColor: tokens.border.default,
                        borderRadius: tokens.radius.element,
                        paddingVertical: tokens.spacing.sm,
                        paddingHorizontal: tokens.spacing.lg,
                    },
                ]}>
                <TText style={{ color: statusPalette.foreground, fontWeight: '500' }}>
                    {StatusMessage()}
                </TText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    status: {
        alignItems: 'center',
        borderWidth: 1,
        minWidth: 160,
    },
})

export default HeartbeatButton
