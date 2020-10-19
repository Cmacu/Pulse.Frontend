import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@aspnet/signalr'
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

let connection: HubConnection | undefined = undefined
let _manuallyClosed = false

const getAccessToken = async (): Promise<string> => {
  const token = await auth.getToken()
  return token
}

const onClose = async (message: unknown) => {
  if (_manuallyClosed) return
  console.error('On close: ', message, _manuallyClosed)
  await start()
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

const onDisconnect = (message: string) => {
  console.error(MESSAGES.disconnected, message)
  Notify.create({
    message: 'Something unexpected happened: ' + message,
    color: 'negative',
    icon: 'error_outline',
  })
  auth.refresh()
  disconnect()
}

const start = (): Promise<void> => {
  if (!connection) return Promise.resolve()

  return connection.start().catch(() => {
    return new Promise((resolve) =>
      setTimeout(() => start().then(() => resolve()), _retryTimeout),
    )
  })
}

const disconnect = () => {
  if (!connection) {
    return
  }
  if (_manuallyClosed) {
    return
  }
  _manuallyClosed = true
  return connection.stop().then(() => {
    connection = undefined
    return Promise.resolve()
  })
}

export const hub = {
  connect: async (url: string) => {
    if (connection) {
      return connection
    }
    _manuallyClosed = false
    connection = new HubConnectionBuilder()
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
    connection.on(HUB.receiveDisconnect, onDisconnect)
    await start()
    connection.onclose(onClose)
    return connection
  },
  disconnect,
}
