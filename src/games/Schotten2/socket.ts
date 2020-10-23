import { Schotten2Api } from 'src/games/Schotten2/game'
import { hub, HubConnection } from 'src/utils/hub'

const HUB = {
  url: process.env.API + '/st2hub',
  sendCheckState: 'CheckState',
  sendRetreat: 'Retreat',
  sendUseOil: 'UseOil',
  sendPlayCard: 'PlayCard',
  sendResign: 'Resign',
  receiveUpdateState: 'UpdateState',
  receiveDisconnect: 'Disconnect',
  receiveError: 'Error',
}

let connection: HubConnection | undefined = undefined
let url = ''

export const socket: Schotten2Api = {
  connect: async (matchId, onUpdateState) => {
    if (connection && connection.state != 0) return
    url = `${HUB.url}?matchId=${matchId}`
    connection = await hub.connect(url)
    connection.on(HUB.receiveUpdateState, onUpdateState)
  },
  load: (key: string) => connection?.send(HUB.sendCheckState, key),
  retreat: (sectionIndex) => connection?.send(HUB.sendRetreat, sectionIndex),
  useOil: (sectionIndex) => connection?.send(HUB.sendUseOil, sectionIndex),
  playCard: (sectionIndex: number, handIndex: number) =>
    connection?.send(HUB.sendPlayCard, sectionIndex, handIndex),
  resign: () => connection?.send(HUB.sendResign),
  disconnect: () => {
    hub.disconnect(url)
  },
}
