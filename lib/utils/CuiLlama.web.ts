/**
 * Web boundary for the native llama runtime.
 *
 * The local inference engine is intentionally native-only.  Keeping the
 * module shape here lets the rest of the app load on web so cloud/API modes
 * remain usable, while calls that actually require a local model fail with a
 * clear message instead of crashing the whole bundle during startup.
 */

const unsupported = (): never => {
    throw new Error('Local LLM inference is unavailable in the web app.')
}

export const RNLLAMA_MTMD_DEFAULT_MEDIA_MARKER = '<__media__>'

export const installJsi = async (): Promise<void> => undefined
export const toggleNativeLog = async (_enabled: boolean): Promise<void> => undefined
export const setContextLimit = async (_limit: number): Promise<void> => undefined
export const releaseAllLlama = async (): Promise<void> => undefined

export const getBackendDevicesInfo = async (): Promise<never[]> => []

export const loadLlamaModelInfo = async (_model: string): Promise<never> => unsupported()
export const initLlama = async (..._args: unknown[]): Promise<never> => unsupported()

export class LlamaContext {
    completion = async (..._args: unknown[]): Promise<never> => unsupported()
    stopCompletion = async (): Promise<never> => unsupported()
    tokenize = async (..._args: unknown[]): Promise<never> => unsupported()
    embedding = async (..._args: unknown[]): Promise<never> => unsupported()
    release = async (): Promise<never> => unsupported()
}

export const BuildInfo = { number: 'web', commit: 'web' }
