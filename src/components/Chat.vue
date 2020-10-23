<template>
  <base-btn flat icon="message" dense padding="none" @click="viewChat">
    <q-badge
      v-if="chatUnreadCount"
      floating
      color="negative"
      :label="chatUnreadCount"
    />
    <q-dialog v-model="showChat" position="right" full-height @hide="closeChat">
      <q-card class="chat">
        <div class="row items-center q-pa-sm">
          <div class="q-pl-sm">{{ matchName }} Chat</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeChat" />
        </div>
        <q-separator inset />
        <div id="chat-messages" class="chat-messages full-width q-px-md">
          <q-chat-message
            v-for="(message, index) in chatMessages"
            :id="`chat-message-${index}`"
            :key="index"
            :name="message.username"
            :bg-color="message.bgColor"
            :avatar="message.avatar"
            :text="[message.message]"
            :sent="message.username == player"
            :stamp="message.createdAt"
            text-sanitize
          />
        </div>
        <q-form class="chat-input absolute-bottom" @submit="sendMessage">
          <q-input
            v-model="chatMessage"
            class="full-width"
            filled
            square
            placeholder="Type a message"
          >
            <slot name="append">
              <q-btn
                v-if="chatMessage.length"
                icon="send"
                flat
                dense
                @click="sendMessage"
              />
              <q-btn v-else icon="close" flat dense @click="closeChat" />
            </slot>
          </q-input>
        </q-form>
      </q-card>
    </q-dialog>
  </base-btn>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
} from '@vue/composition-api'
import { hub, HubConnection } from 'src/utils/hub'
import store from 'src/store'
import date from 'src/utils/date'

export interface ChatMessage {
  username: string
  avatar: string
  createdAt: string
  message: string
  isRead: boolean
  bgColor?: string
}

export default defineComponent({
  name: 'Chat',
  props: {
    matchId: {
      type: Number,
      default: 0,
    },
    matchName: {
      type: String,
      default: '',
    },
  },
  setup: (props) => {
    const showChat = ref(false)
    const chatUnreadCount = ref(0)
    const chatMessage = ref('')
    const chatMessages = ref<ChatMessage[]>([])
    const player = computed(() => store.state.player.username)

    const hubUrl = computed(
      () => `${process.env.API}/chat/hub?matchId=${props.matchId}`,
    )

    const scrollToLastMessage = () => {
      setTimeout(() => {
        const el = document.getElementById(
          'chat-message-' + (chatMessages.value.length - 1),
        )
        el?.scrollIntoView(false)
      }, 100)
    }

    const onReceiveMessage = (message: ChatMessage) => {
      if (!message.isRead && message.username != player.value) {
        chatUnreadCount.value++
        message.username += ' (new)'
      }
      if (message.username != store.state.player.username)
        message.bgColor = 'info'

      message.createdAt = date.utc(message.createdAt).local().calendar()
      message.avatar = store.getters.config.getAvatar(
        message.username,
        message.avatar,
      )
      chatMessages.value.push(message)
      scrollToLastMessage()
    }

    let hubConnection: HubConnection | undefined = undefined

    onMounted(async () => {
      hubConnection = await hub.connect(hubUrl.value)
      hubConnection.on('ReceiveMessage', onReceiveMessage)
      hubConnection.on('ReceiveMessages', (messages: ChatMessage[]) =>
        messages.forEach(onReceiveMessage),
      )
    })

    onUnmounted(async () => {
      hubConnection = await hub.disconnect(hubUrl.value)
    })

    return {
      showChat,
      chatMessage,
      chatMessages,
      chatUnreadCount,
      player,
      sendMessage: () => {
        hubConnection?.send('SubmitMessage', chatMessage.value)
        chatMessage.value = ''
      },
      viewChat: () => {
        showChat.value = true
        scrollToLastMessage()
      },
      closeChat: () => {
        showChat.value = false
        if (chatUnreadCount) hubConnection?.send('MarkRead')
        chatUnreadCount.value = 0
      },
    }
  },
})
</script>

<style lang="sass" scoped>
.chat
  position: relative
  font-size: 16px
  margin-top: 50px
  width: 100vw
  max-width: 400px
  font-size: 16px

.chat-messages
  overflow-y: auto
  padding-top: 110px
  position: absolute
  bottom: 110px
  max-height: calc( 100% - 180px )

.chat-input
  margin-bottom: 50px
</style>
