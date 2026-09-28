/**
 * Browsers have no native headless service. Run the existing inference task
 * in the foreground; cancellation still belongs to the inference AbortController.
 * Metro resolves this module only on web, leaving native background execution intact.
 */
const BackgroundActions = {
    async start<T>(task: (parameters?: T) => Promise<void>, options: { parameters?: T }) {
        await task(options.parameters)
    },
}

export default BackgroundActions
