/** Web-safe surface for the native file-system helpers. */

const unsupported = (): never => {
    throw new Error('Native file-system access is unavailable in the web app.')
}

export const getContentFd = async (_uri: string): Promise<string | undefined> => undefined
export const closeFd = async (_uri: string): Promise<void> => undefined
export const persistContentPermission = async (_uri: string): Promise<void> => undefined
export const copyFileSAF = async (..._args: unknown[]): Promise<void> => unsupported()

export const localDownload = async (_uri: string): Promise<void> => undefined
export const requestStoragePermission = async (): Promise<'granted'> => 'granted'
