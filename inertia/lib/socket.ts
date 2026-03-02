import { io, type Socket } from 'socket.io-client'

// Only connect in the browser (SSR guard)
export const socket: Socket | null = typeof window !== 'undefined' ? io() : null
