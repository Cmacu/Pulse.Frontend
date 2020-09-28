<template>
  <q-layout view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default shadow-6">
      <div class="page-container q-pa-sm row">
        <div class="col-3 text-left">
          <q-icon name="menu" size="1.3rem" />
        </div>
        <a href="/" target="_blank" class="col text-center text-white">
          <q-avatar class="q-mr-xs" size="1.33rem">
            <img :src="config.icon" />
          </q-avatar>
          <span>pulse</span>
          <span class="text-primary">games</span>
          <span>.io</span>
        </a>
        <div class="col-3 text-right">
          &nbsp;<span>1:10</span>&nbsp;
          <q-icon name="timer" size="1.3rem" />
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
      <router-view
        :key="$route.fullPath"
        :players="[attacker, defender]"
        :matchId="matchId"
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'
import store from 'src/store'
import api from 'src/utils/api'
import { OpponentInterface } from 'src/store/modules/matchmaker'

export default defineComponent({
  name: 'GameLayout',
  props: {
    matchId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true)
    const attacker = ref<OpponentInterface>()
    const defender = ref<OpponentInterface>()
    onMounted(async () => {
      const response = await api.getMatch(props.matchId)
      const players = response.data.opponents.sort(
        (x: OpponentInterface, y: OpponentInterface) => x.position - y.position,
      )
      attacker.value = players[0]
      defender.value = players[1]
      loading.value = false
    })
    return {
      attacker,
      isAttacker: computed(
        () => store.state.player.username == attacker.value?.username,
      ),
      defender,
      config: computed(() => store.state.config),
    }
  },
})
</script>
