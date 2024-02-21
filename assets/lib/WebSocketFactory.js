import { AuthenticateMessage } from '~/assets/proto/messages.ts'
import { makePacket } from '~/assets/proto/ProtoUtil.ts'

export class WebSocketFactory {
  static jwt = null

  static create(endpoint, $paths) {
    return new Promise((resolve, reject) => {
      let connected = false
      const ws = new WebSocket(`${$paths.WS_BASE_URL}${endpoint}`)

      ws.addEventListener('open', async () => {
        ws.send(makePacket(AuthenticateMessage, {
          jwt: this.jwt,
          clientVersion: await window.electronApi.invoke('updater.getVersion'),
        }))

        resolve(ws)
        connected = true
      })

      ws.addEventListener('error', reject)

      // Prevent dangling connections
      setTimeout(() => {
        if (!connected) {
          ws.close()
        }
      }, 20000)
    })
  }
}
