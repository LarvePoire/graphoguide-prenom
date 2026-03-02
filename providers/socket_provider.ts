import type { ApplicationService } from '@adonisjs/core/types'

export default class SocketProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    if (this.app.getEnvironment() !== 'web') return

    const [{ Server: IOServer }, { createAdapter }, { Redis }, { default: server }, { default: env }] =
      await Promise.all([
        import('socket.io'),
        import('@socket.io/redis-adapter'),
        import('ioredis'),
        import('@adonisjs/core/services/server'),
        import('#start/env'),
      ])

    const httpServer = server.getNodeServer()
    if (!httpServer) throw new Error('[Socket] HTTP server not available')

    const password = env.get('REDIS_PASSWORD').release()
    const pubClient = new Redis({
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
      ...(password ? { password } : {}),
    })
    const subClient = pubClient.duplicate()

    const io = new IOServer(httpServer, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    io.adapter(createAdapter(pubClient, subClient))

    io.on('connection', (socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`)
    })
  }
}
