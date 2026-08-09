import { Image, ImageProps } from 'expo-image'

interface FallbackImageProps extends Omit<ImageProps, 'source' | 'onError'> {
    targetImage: string
}

const Avatar: React.FC<FallbackImageProps> = ({ targetImage, ...rest }) => {
    return (
        <Image
            {...rest}
            source={targetImage.startsWith('web://') ? undefined : { uri: targetImage }}
            placeholder={require('@assets/user.png')}
            cachePolicy="none"
            placeholderContentFit="contain"
        />
    )
}

export default Avatar
