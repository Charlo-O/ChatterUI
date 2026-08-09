const unsupported = (): never => {
    throw new Error('PNG character-card import and export are unavailable on web.')
}

export const extractPngTextChunk = (): string => unsupported()
export const replacePngTextChunk = (): string => unsupported()
