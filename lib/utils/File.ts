import { localDownload } from '@vali98/react-native-fs'
import { getDocumentAsync } from 'expo-document-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { Logger } from '../state/Logger'

const documentUri = Platform.OS === 'web' ? 'web://document/' : Paths.document.uri
const cacheUri = Platform.OS === 'web' ? 'web://cache/' : Paths.cache.uri
const isWebVirtualPath = (path: string) => Platform.OS === 'web' && path.startsWith('web://')

const downloadString = async (
    data: string,
    filename: string,
    encoding: 'base64' | `utf8`
) => {
    if (Platform.OS === 'web') {
        const bytes =
            encoding === 'base64'
                ? Uint8Array.from(atob(data), (character) => character.charCodeAt(0))
                : undefined
        const blob = new Blob(bytes ? [bytes] : [data], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        URL.revokeObjectURL(url)
        return
    }

    const file = new File(Paths.cache, filename)
    await file.write(data, { encoding })
    await localDownload((Paths.cache.uri + filename).replace('file://', '')).catch((e) =>
        Logger.error('Failed to download: ' + e)
    )
}

export const AppDirectory = {
    ModelPath: `${documentUri}models/`,
    SessionPath: `${documentUri}session/`,
    CharacterPath: `${documentUri}characters/`,
    Assets: `${documentUri}appAssets/`,
    Attachments: `${documentUri}attachments/`,
}

export namespace FileUtils {
    export const getDocumentDir = (dir: string) => {
        return `${documentUri}${dir}`
    }

    export const getCacheDir = (dir: string) => {
        return `${cacheUri}${dir}`
    }

    /**
     *
     * @param data string data of file
     * @param filename filename to be written, include extension
     * @param encoding encoding of file
     */
    export const saveStringToDownload = async (
        data: string,
        filename: string,
        encoding: 'base64' | `utf8`
    ) => {
        await downloadString(data, filename, encoding)
    }

    export const pickText = async (params: { type?: string } = {}): Promise<PickerResult> => {
        return pickStringDocument({ encoding: 'utf8', type: params.type })
    }

    export const pickBase64 = async (params: { type?: string } = {}): Promise<PickerResult> => {
        return pickStringDocument({ encoding: 'base64', type: params.type })
    }

    export const pickJSON = async (params: { type?: string } = {}): Promise<PickerResult> => {
        const result = await pickText(params)
        if (!result.success) return result
        try {
            return { success: true, data: JSON.parse(result.data) }
        } catch {
            return { success: false }
        }
    }

    const pickFile = async (
        fileReader: (file: File) => Promise<string>,
        { type = '*/*' }: { type?: string } = {}
    ): Promise<PickerResult> => {
        const result = await getDocumentAsync({ type: type })
        if (result.canceled) {
            return { success: false }
        }
        const [asset] = result.assets
        const file = new File(asset.uri)
        let data = await fileReader(file)
        if (!data) {
            return { success: false }
        }
        return { success: true, data: data }
    }
}

export const saveStringToDownload = async (
    data: string,
    filename: string,
    encoding: 'base64' | `utf8`
) => downloadString(data, filename, encoding)

type PickerResult = { success: false } | { success: true; data: string }

type JSONPickerResult = { success: false } | { success: true; data: any }

/**@deprecated */
export const pickJSONDocument = async (): Promise<JSONPickerResult> => {
    const result = await pickStringDocument({ type: 'application/json' })
    if (!result.success) return result
    try {
        const jsonData = JSON.parse(result.data)
        return { success: true, data: jsonData }
    } catch {
        return { success: false }
    }
}

/**@deprecated */
export const pickStringDocument = async ({
    encoding = 'utf8',
    type = '*/*',
}: {
    encoding?: 'utf8' | 'base64'
    type?: string
} = {}): Promise<PickerResult> => {
    const result = await getDocumentAsync({ type: type })
    if (result.canceled) {
        return { success: false }
    }
    const uri = result.assets[0].uri
    let data = ''
    if (Platform.OS === 'web') {
        data =
            encoding === 'utf8' ? await readStringAsync(uri) : await readBase64Async(uri)
    } else {
        const file = new File(uri)
        if (encoding === 'utf8') data = await file.text()
        else data = await file.base64()
    }

    if (!data) {
        return { success: false }
    }
    return { success: true, data: data }
}

const gb = 1000 ** 3
const mb = 1000 ** 2

/**
 * Gets a human friendly version of file size
 * @param size size in bytes
 * @returns string containing readable file size
 */
export const readableFileSize = (size: number) => {
    if (size < gb) {
        const sizeInMB = size / mb
        return `${sizeInMB.toFixed(2)} MB`
    } else {
        const sizeInGB = size / gb
        return `${sizeInGB.toFixed(2)} GB`
    }
}

export const listFiles = (path: string) => {
    if (isWebVirtualPath(path)) return []
    return new Directory(path)
        .listAsRecords()
        .filter((item) => !item.isDirectory)
        .map((item) => {
            const uri = item.uri.endsWith('/') ? item.uri.slice(0, -1) : item.uri
            return uri.slice(uri.lastIndexOf('/') + 1)
        })
        .filter((item): item is string => !!item)
}

export const fileExists = (path: string) => {
    if (isWebVirtualPath(path)) return false
    return new File(path).exists
}

export const directoryExists = (path: string) => {
    if (isWebVirtualPath(path)) return false
    return new Directory(path).exists
}

export const copyFile = async ({ from, to }: { from: string; to: string }) => {
    if (isWebVirtualPath(from) || isWebVirtualPath(to)) return false
    try {
        new File(from).copy(new File(to))
        return true
    } catch (e) {
        Logger.error('Failed to copy: ' + e)
        return false
    }
}

export const deleteFile = (path: string) => {
    if (isWebVirtualPath(path)) return true
    try {
        const file = new File(path)
        if (file.exists) file.delete()
        return true
    } catch (e) {
        Logger.error('Failed to delete: ' + e)
        return false
    }
}

export const readBase64Async = async (path: string) => {
    if (Platform.OS === 'web') {
        if (isWebVirtualPath(path)) return ''
        const response = await fetch(path)
        if (!response.ok) return ''
        const bytes = new Uint8Array(await response.arrayBuffer())
        let binary = ''
        const chunkSize = 0x8000
        for (let index = 0; index < bytes.length; index += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
        }
        return btoa(binary)
    }
    return await new File(path).base64()
}

export const readStringAsync = async (path: string) => {
    if (Platform.OS === 'web') {
        if (isWebVirtualPath(path)) return ''
        const response = await fetch(path)
        return response.ok ? response.text() : ''
    }
    return await new File(path).text()
}

export const writeBase64File = async (path: string, content: string) => {
    if (isWebVirtualPath(path)) return false
    return await new File(path).write(content, { encoding: 'base64' })
}

export const fileInfo = (path: string) => {
    // Expo FileSystem's web adapter cannot inspect the app's virtual `web://`
    // paths. Treat those paths as an empty file instead of throwing from
    // `validatePath`; native file-backed behavior remains unchanged.
    if (Platform.OS === 'web' && path.startsWith('web://')) {
        return { exists: false, size: 0, uri: path }
    }
    return new File(path).info()
}

export const makeDirectory = async (path: string) => {
    if (isWebVirtualPath(path)) return
    new Directory(path).create({ idempotent: true })
}
