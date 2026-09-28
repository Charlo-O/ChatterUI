// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('sql')
config.resolver.assetExts.push('gguf', 'raw', 'wasm')
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'react-native-background-actions') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/BackgroundActions.web.ts'),
        }
    }

    if (platform === 'web' && moduleName === '@vali98/react-native-process-text') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/ProcessText.web.ts'),
        }
    }

    if (platform === 'web' && moduleName === '@vali98/react-native-cpu-info') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/CpuInfo.web.ts'),
        }
    }

    if (platform === 'web' && moduleName === '@vali98/react-native-fs') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/ReactNativeFs.web.ts'),
        }
    }

    if (platform === 'web' && moduleName === 'cui-llama.rn') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/CuiLlama.web.ts'),
        }
    }

    if (platform === 'web' && moduleName === '@vali98/react-native-png-utils') {
        return {
            type: 'sourceFile',
            filePath: path.resolve(__dirname, 'lib/utils/PngUtils.web.ts'),
        }
    }

    if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
        return {
            type: 'sourceFile',
            filePath: require.resolve(moduleName),
        }
    }

    return context.resolveRequest(context, moduleName, platform)
}
config.server.enhanceMiddleware = (middleware) => (request, response, next) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    return middleware(request, response, next)
}

module.exports = config
