import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from '@aspnet/signalr'
import auth from './auth'
import store from 'src/store'
import { getRandomInRange } from './tools'
import { Notify } from 'quasar'
import { NOTIFICATIONS } from 'src/store/modules/config'

const SOCKETS = {
  url: process.env.API + '/matchmaker',
  sendRun: 'RunMatchmaker',
  scheduleMatchmakerRun: 'ScheduleMatchmakerRun',
  scheduleDisconnect: 'ScheduleDisconnect',
  receiveDisconnect: 'Disconnect',
  receiveMatched: 'Matched',
  receivePlaying: 'Playing',
  receiveError: 'Error',
}

const MESSAGES = {
  retry: 'Connection issues. Trying again.',
  failed: 'Failed to connect with hub',
  run: 'SOCKET-SEND: Run Matchmaker. ',
  postpone: 'SOCKET-RECEIVE: Postpone Matchmaker. ',
  timeout: 'SOCKET-RECEIVE: Disconnect Timeout. ',
  found: 'SOCKET-RECEIVE: Match Found!',
  started: 'SOCKET-RECEIVE: match in progress',
  disconnected: 'SOCKET-RECEIVE: Disconnected',
  close: 'SOCKET: close connection',
}

const _retryCount = 6
const _retryTimeout = 10 * 1000 // 10 seconds
const _defaultTimeout = 10 * 60 * 1000 // 10 minutes

let connection: HubConnection | undefined = undefined
let _runTimeout: undefined | NodeJS.Timeout = undefined
let _manuallyClosed = false

function getRandomDelay(delay: number): number {
  return getRandomInRange(delay, delay * 0.2)
}

const getAccessToken = async (): Promise<string> => {
  const token = await auth.getToken()
  return token
}

const onMatched = (message: string) => {
  console.info(MESSAGES.found, message)
  store.dispatch.matchmaker.setMatched()
}

const onPlaying = (matchId: string) => {
  console.info(MESSAGES.started, matchId)
  disconnect()
  store.dispatch.matchmaker.startMatch(matchId)
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

const onClose = async (message: unknown) => {
  if (_manuallyClosed) return
  console.error('On close: ', message, _manuallyClosed)
  await start()
}

const scheduleMatchmakerRun = (delay: number) => {
  // console.info(MESSAGES.postpone, delay)
  if (_runTimeout !== undefined) clearTimeout(_runTimeout)
  const runDelay = getRandomDelay(delay)
  // console.info('Delay:', runDelay)
  _runTimeout = setTimeout(() => connection?.send(SOCKETS.sendRun), runDelay)
}

const start = (err: Error = new Error(), retryCount = 0): Promise<void> => {
  if (!connection) return Promise.resolve()
  if (retryCount > _retryCount) {
    console.error(MESSAGES.failed, err)
    Notify.create(store.state.config.notifications[NOTIFICATIONS.SOCKET_ERROR])
    store.dispatch.matchmaker.cancelSearch()
    return Promise.reject()
  }
  return connection
    .start()
    .catch(
      (error) =>
        new Promise((resolve) =>
          setTimeout(
            () => start(error, retryCount + 1).then(() => resolve()),
            _retryTimeout,
          ),
        ),
    )
}

export const connect = async () => {
  if (connection) {
    return
  }
  _manuallyClosed = false
  console.info('Start socket')
  connection = new HubConnectionBuilder()
    .withUrl(SOCKETS.url, {
      accessTokenFactory: getAccessToken,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(LogLevel.Information)
    .build()
  connection.serverTimeoutInMilliseconds = _defaultTimeout

  // Handle messages
  connection.on(SOCKETS.scheduleMatchmakerRun, scheduleMatchmakerRun)
  connection.on(SOCKETS.receiveMatched, onMatched)
  connection.on(SOCKETS.receivePlaying, onPlaying)
  connection.on(SOCKETS.receiveDisconnect, onDisconnect)
  connection.on(SOCKETS.receiveError, onDisconnect)
  // Handle disconnects
  // connection.onclose = onClose
  await start()
  connection.onclose(onClose)
}

export const disconnect = () => {
  if (!connection) {
    return
  }
  if (_manuallyClosed) {
    return
  }
  // console.info(MESSAGES.close)
  _manuallyClosed = true
  if (_runTimeout !== undefined) clearTimeout(_runTimeout)
  store.dispatch.matchmaker.cancelSearch()
  return connection.stop().then(() => {
    return Promise.resolve()
  })
}

export const reset = () => {
  connection = undefined
}
