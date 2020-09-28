import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@aspnet/signalr'
import { Notify } from 'quasar'
import { Schotten2State } from 'src/games/Schotten2/game'
import auth from 'src/utils/auth'

const HUB = {
  url: process.env.API + '/st2hub',
  sendRetreat: 'Retreat',
  sendUseOil: 'UseOil',
  sendPlayCard: 'PlayCard',
  sendResign: 'Resign',
  receiveUpdateState: 'UpdateState',
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
  return connection.stop()
}

type UpdateStateFunction = (gameState: Schotten2State) => void

const connect = async (matchId: string, onUpdateState: UpdateStateFunction) => {
  if (connection) {
    return
  }
  _manuallyClosed = false
  console.info('Start socket')
  connection = new HubConnectionBuilder()
    .withUrl(`${HUB.url}?matchId=${matchId}`, {
      accessTokenFactory: getAccessToken,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.Information)
    .build()
  connection.serverTimeoutInMilliseconds = _defaultTimeout
  // Handle messages
  connection.on(HUB.receiveUpdateState, onUpdateState)
  // Handle disconnects
  connection.on(HUB.receiveDisconnect, onDisconnect)
  connection.on(HUB.receiveError, onDisconnect)
  await start()
  connection.onclose(onClose)
}

const playCard = (sectionIndex: number, handIndex: number) => {
  // console.error(`Sending: Section ${sectionIndex}, Card ${handIndex}`)
  return connection?.send(HUB.sendPlayCard, sectionIndex, handIndex)
}

const retreat = (sectionIndex: number) => {
  // console.error(`Sending: Section ${sectionIndex}, Card ${handIndex}`)
  return connection?.send(HUB.sendRetreat, sectionIndex)
}

const useOil = (sectionIndex: number) => {
  // console.error(`Sending: Section ${sectionIndex}, Card ${handIndex}`)
  return connection?.send(HUB.sendUseOil, sectionIndex)
}

const resign = () => connection?.send(HUB.sendResign)

export const socket = { connect, retreat, useOil, playCard, resign, disconnect }
