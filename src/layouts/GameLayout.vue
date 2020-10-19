<template>
  <q-layout view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default" style="font-size: 21px" elevated>
      <q-toolbar class="page-container row">
        <div class="col-auto col-sm-3">
          <base-btn flat icon="timer" dense padding="none" @click="showTimer">
            <span :class="timerColor">&nbsp;{{ timer }}</span>
          </base-btn>
        </div>
        <div class="col row text-white justify-center items-center">
          <q-avatar class="q-mr-xs" @click="location.href = '/'">
            <img :src="config.icon" />
          </q-avatar>
          <a href="http://pulsegames.io" target="_blank" class="text-white">
            <span>pulse</span>
            <span class="text-primary">games</span>
            <span>.io</span>
            <!-- <span class="text-bold text-primary">&nbsp;{{ config.game }}</span> -->
          </a>
        </div>
        <div class="col-1 col-sm-3 text-right">
          <base-btn flat icon="message" dense padding="none" @click="viewChat">
            <q-badge
              v-if="chatUnreadCount"
              floating
              color="negative"
              :label="chatUnreadCount"
            />
          </base-btn>
        </div>
      </q-toolbar>
      <q-linear-progress v-if="loading" class="absolute" indeterminate />
    </q-header>

    <q-pull-to-refresh @refresh="refresh">
      <q-page-container>
        <router-view
          :key="$route.fullPath"
          :matchId="matchId"
          :matchName="matchName"
          :attacker="attacker"
          :defender="defender"
        />
      </q-page-container>
    </q-pull-to-refresh>

    <!-- TIMER DIALOG -->
    <q-dialog v-model="showTimerDetails" position="top">
      <q-card class="page-container" :style="{ marginTop: '50px' }">
        <q-card-section class="row items-center">
          <div>Timer</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator inset />
        <q-card-section class="text-center">
          {{ timerDescription }}
        </q-card-section>
        <q-card-section class="row" :class="{ reverse: !isAttacker }">
          <div class="col text-accent">
            <div class="text-center">{{ attacker }}</div>
            <div class="text-center text-special-16 q-mb-xs">
              {{ attackerReserve }}
            </div>
            <div class="text-center text-special-07">reserve left</div>
          </div>
          <div class="col text-primary">
            <div class="text-center">{{ defender }}</div>
            <div class="text-center text-special-16 q-mb-xs">
              {{ defenderReserve }}
            </div>
            <div class="text-center text-special-07">reserve left</div>
          </div>
        </q-card-section>
        <q-card-actions
          align="between"
          class="row"
          :class="{ reverse: !isAttacker }"
        >
          <q-btn :label="attackerLabel" color="accent" outline>
            <span>&nbsp;1 min</span>
            <q-badge color="grey" floating>WIP</q-badge>
          </q-btn>
          <q-space />
          <q-btn :label="defenderLabel" color="primary" outline>
            <span>&nbsp;1 min</span>
            <q-badge color="grey" floating>WIP</q-badge>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showChat" position="right" full-height @hide="closeChat">
      <q-card class="chat">
        <div class="row items-center q-pa-sm">
          <div class="q-pl-sm">{{ matchName }} Chat</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeChat" />
        </div>
        <q-separator inset />
        <div id="chat-messages" class="chat-messages q-px-md">
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'
import store from 'src/store'
import api from 'src/utils/api'
import { formatTimer } from 'src/utils/format'
import { OpponentInterface } from 'src/store/modules/matchmaker'
import { chat, ChatMessage } from 'src/utils/chat'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import calendar from 'dayjs/plugin/calendar'

export default defineComponent({
  name: 'GameLayout',
  props: {
    matchId: {
      type: String,
      required: true,
    },
    defend: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    dayjs.extend(utc)
    dayjs.extend(calendar)
    const showTimerDetails = ref(false)
    const showChat = ref(false)
    const loading = ref(false)
    const timerDescription = ref('')
    const attackerReserve = ref('1m15s')
    const defenderReserve = ref('4h20m')
    const attacker = ref('Aife')
    const defender = ref('Chulainn')
    const matchName = ref('')
    const chatUnreadCount = ref(0)
    const chatMessage = ref('')
    const chatMessages = ref<ChatMessage[]>([])

    const onReceiveMessage = (message: ChatMessage) => {
      if (!message.isRead && message.username != store.state.player.username) {
        chatUnreadCount.value++
        message.username += ' (new)'
      }
      if (message.username != store.state.player.username)
        message.bgColor = 'info'

      message.createdAt = dayjs.utc(message.createdAt).local().calendar()
      message.avatar = store.getters.config.getAvatar(
        message.username,
        message.avatar,
      )
      chatMessages.value.push(message)
      scrollToLastMessage()
    }

    const scrollToLastMessage = () => {
      setTimeout(() => {
        const el = document.getElementById(
          'chat-message-' + (chatMessages.value.length - 1),
        )
        el?.scrollIntoView(false)
      }, 100)
    }

    onMounted(async () => {
      if (props.matchId == 'demoAttack') {
        matchName.value = 'Attack Demo'
        return (attacker.value = 'Milord')
      }
      if (props.matchId == 'demoDefense') {
        matchName.value = 'Defense Demo'
        return (defender.value = 'Milord')
      }

      const response = await api.getMatch(props.matchId)
      const players = response.data.opponents.sort(
        (x: OpponentInterface, y: OpponentInterface) => x.position - y.position,
      )
      attacker.value = players[0].username
      defender.value = players[1].username
      matchName.value = response.data.name
      if (!store.state.player.username) {
        await store.dispatch.player.updatePlayer()
      }

      chat.connect(props.matchId, onReceiveMessage)
    })

    const isAttacker = computed(
      () => attacker.value == store.state.player.username,
    )
    return {
      chatMessage,
      chatMessages,
      chatUnreadCount,
      showTimerDetails,
      showChat,
      loading,
      timerDescription,
      attackerReserve,
      defenderReserve,
      isAttacker,
      location,
      matchName,
      attacker,
      defender,
      player: computed(() => store.state.player.username),
      attackerLabel: computed(() => (isAttacker ? 'Give' : 'Request')),
      defenderLabel: computed(() => (!isAttacker ? 'Give' : 'Request')),
      timer: computed(() => store.getters.timer.getTimer),
      timerColor: computed(() =>
        store.state.timer.isReserve ? 'text-negative' : 'text-primary',
      ),
      refresh: () => location.reload(),
      config: computed(() => store.state.config),
      showTimer: async () => {
        loading.value = true
        const response = await api.getTimer(props.matchId)
        timerDescription.value = response.data.description
        attackerReserve.value = formatTimer(response.data.attackReserve)
        defenderReserve.value = formatTimer(response.data.defenseReserve)
        loading.value = false
        showTimerDetails.value = true
      },
      sendMessage: () => {
        console.error(chatMessage.value)
        chat.submitMessage(chatMessage.value)
        chatMessage.value = ''
      },
      viewChat: () => {
        showChat.value = true
        scrollToLastMessage()
      },
      closeChat: () => {
        showChat.value = false
        if (chatUnreadCount) {
          chat.markRead()
          chatUnreadCount.value = 0
        }
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
