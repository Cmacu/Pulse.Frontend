<template>
  <div v-if="loading" class="flex flex-center fullscreen bg-default">
    <q-spinner-dots size="10em" color="primary" />
  </div>
  <q-layout v-else view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default shadow-6">
      <div class="page-container q-pa-sm row">
        <div class="col">
          <div class="row no-wrap">
            <q-avatar class="q-mr-xs" size="1.25rem">
              <img :src="config.icon" />
            </q-avatar>
            <div class="ellipsis">
              <span>Pulse {{ matchName }}</span
              >&nbsp;
              <q-icon name="history" size="1rem" />
            </div>
          </div>
        </div>
        <div class="col text-center">
          <q-icon name="timer" size="1rem" />
          &nbsp;<span>1:10</span>&nbsp;
          <q-icon name="more_time" size="1rem" />
        </div>
        <div class="col text-right">
          <span :class="{ 'text-bold': isAttacker }">{{
            attacker ? attacker.username : ''
          }}</span>
          <q-icon name="clear" color="primary" size="1rem" />
          <span :class="{ 'text-bold': !isAttacker }">{{
            defender ? defender.username : ''
          }}</span>
        </div>
      </div>
    </q-header>
    <!-- <q-drawer
      v-model="showDrawer"
      side="right"
      :width="240"
      behavior="desktop"
      persistent
      elevated
    >
      <div class="column full-height">
        <SchottenState class="col column items-center" />
        <SchottenActions style="margin-top: 50px; margin-bottom: 10px;" />
      </div>
    </q-drawer> -->
    <q-page-container>
      <router-view :key="$route.fullPath" :players="[attacker, defender]" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  ref,
} from '@vue/composition-api'
import store from 'src/store'
import api from 'src/utils/api'
import { OpponentInterface } from 'src/store/modules/matchmaker'

export default defineComponent({
  name: 'GameLayout',
  setup() {
    const loading = ref(true)
    const attacker = ref<OpponentInterface>()
    const defender = ref<OpponentInterface>()
    const htmlElement = document.documentElement
    onMounted(async () => {
      htmlElement.className = 'resize-game'
      const response = await api.getLastMatch()
      const players = response.data.opponents.sort(
        (x: OpponentInterface, y: OpponentInterface) => x.position - y.position,
      )
      attacker.value = players[0]
      defender.value = players[1]
      loading.value = false
    })
    onUnmounted(() => {
      htmlElement.className = ''
    })
    return {
      loading: computed(() => store.state.match.loading),
      attacker,
      isAttacker: computed(
        () => store.state.player.username == attacker.value?.username,
      ),
      defender,
      matchName: computed(() => store.state.match.name),
      config: computed(() => store.state.config),
    }
  },
})
</script>

<style lang="sass">
html.resize-game
  font-size: 16px
  @media(min-height: 900px)
    font-size: 20px
  @media(min-height: 1100px)
    font-size: 26px
  @media(min-height: 1300px)
    font-size: 32px

.match-layout
  font-size: 0.85rem
</style>
