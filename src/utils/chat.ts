import { HubConnection } from '@aspnet/signalr'
import { hub } from 'src/utils/hub'

export interface ChatMessage {
  username: string
  avatar: string
  createdAt: string
  message: string
  isRead: boolean
  bgColor?: string
}

let connection: HubConnection | undefined = undefined

export const chat = {
  connect: async (
    matchId: string,
    onReceiveMessage: (message: ChatMessage) => void,
  ) => {
    connection = await hub.connect(
      `${process.env.API}/chat/hub?matchId=${matchId}`,
    )
    connection.on('receiveMessage', onReceiveMessage)
    connection.on('receiveMessages', (messages: ChatMessage[]) =>
      messages.forEach(onReceiveMessage),
    )
  },
  submitMessage: (message: string) =>
    connection?.send('SubmitMessage', message),
  markRead: () => connection?.send('MarkRead'),
  disconnect: hub.disconnect,
}
