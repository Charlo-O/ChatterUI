export type ToastApi = {
    SHORT: number
    show: (message: string, duration?: number, options?: { textColor?: string }) => void
}

const Toast: ToastApi = {
    SHORT: 0,
    show: () => undefined,
}

export default Toast
