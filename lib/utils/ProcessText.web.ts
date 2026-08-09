import { useEffect, useState } from 'react'

export const setTextIntentEnabled = async (_enabled: boolean): Promise<void> => undefined
export const getTextIntentEnabled = async (): Promise<boolean> => false
export const getTextIntentResult = async (): Promise<string | null> => null

export const useTextIntentOnForeground = (
    callback: (text: string | null) => void,
    deps: any[] = []
) => {
    useEffect(() => {
        void callback
    }, deps)
}

export const useTextIntentStatus = () => {
    const [enabled, setEnabledState] = useState(false)
    return {
        enabled,
        setEnabled: async (value: boolean) => {
            setEnabledState(value)
        },
    }
}
