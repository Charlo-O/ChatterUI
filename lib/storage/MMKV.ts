import { createMMKV } from 'react-native-mmkv'
import { createJSONStorage, StateStorage } from 'zustand/middleware'

export const mmkv = createMMKV()

const isServer = typeof window === 'undefined'
const serverStorage = new Map<string, string>()

export const getMMKVString = (name: string) =>
    (isServer ? serverStorage.get(name) : mmkv.getString(name)) ?? null
export const setMMKVString = (name: string, value: string) => {
    if (isServer) {
        serverStorage.set(name, value)
        return
    }
    mmkv.set(name, value)
}
const removeString = (name: string) => {
    if (isServer) {
        serverStorage.delete(name)
        return
    }
    mmkv.remove(name)
}

export const mmkvStorage: StateStorage = {
    setItem: (name, value) => {
        return setMMKVString(name, value)
    },
    getItem: (name) => {
        return getMMKVString(name)
    },
    removeItem: (name) => {
        return removeString(name)
    },
}

export const createMMKVStorage = () => {
    return createJSONStorage(() => mmkvStorage)
}
