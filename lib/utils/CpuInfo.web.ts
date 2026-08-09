export const getThreads = (): number =>
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 1

export const getCpuFeatures = async () => ({
    neon: false,
    fp16: false,
    dotprod: false,
    sve: false,
    sve2: false,
})
