import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@aspnet/signalr'
import { connect } from 'http2'
import { Notify } from 'quasar'
import auth from 'src/utils/auth'

const HUB = {
  receiveDisconnect: 'Disconnect',
  receiveError: 'Error',
}

const _retryTimeout = 5 * 1000 // 1 seconds
const _defaultTimeout = 10 * 60 * 1000 // 10 minutes

const MESSAGES = {
  retry: 'Connection issues. Please refresh the page.',
  failed: 'Failed to connect with game hub',
  disconnected: 'SOCKET-RECEIVE: Disconnected',
}

const connections: { [key: string]: HubConnection | undefined } = {}

const getAccessToken = async (): Promise<string> => {
  const token = await auth.getToken()
  return token
}

const onClose = async (url: string, message: unknown) => {
  const connection = connections[url]
  if (!connection) return
  console.error('On close: ', message)
  await start(connection)
}

const onError = (message: string) => {
  console.error(MESSAGES.disconnected, message)
  Notify.create({
    message: 'Something unexpected happened: ' + message,
    color: 'negative',
    icon: 'error_outline',
  })
  auth.refresh()
}

const start = (connection: HubConnection): Promise<void> => {
  if (!connection) return Promise.resolve()

  return connection.start().catch(() => {
    return new Promise((resolve) =>
      setTimeout(() => start(connection).then(() => resolve()), _retryTimeout),
    )
  })
}

export const hub = {
  connect: async (url: string): Promise<HubConnection> => {
    const existing = connections[url]
    if (existing) return existing
    const connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: getAccessToken,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build()
    connection.serverTimeoutInMilliseconds = _defaultTimeout
    // Handle disconnects
    connection.on(HUB.receiveError, onError)
    await start(connection)
    connection.onclose((message: unknown) => onClose(url, message))
    connections[url] = connection
    return connection
  },
  disconnect: (url: string) => {
    const connection = connections[url]
    if (!connection) return undefined
    connections[url] = undefined
    return connection.stop().then(() => {
      return Promise.resolve(undefined)
    })
  },
}

export { HubConnection }
