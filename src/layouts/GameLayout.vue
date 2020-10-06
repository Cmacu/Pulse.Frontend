<template>
  <q-layout view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default" style="font-size: 21px;" elevated>
      <q-toolbar class="page-container row">
        <div class="col-1 col-sm-3">
          <base-btn
            flat
            :icon="config.buttons.menu.icon"
            dense
            padding="none"
          />
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
        <div class="col-auto col-sm-3 text-right">
          <base-btn flat icon-right="timer" dense padding="none">
            <span class="text-primary">1:11</span>
          </base-btn>
        </div>
      </q-toolbar>
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
    defend: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const attacker = ref('Aife')
    const defender = ref('Chulainn')
    const matchName = ref('')
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
    })
    return {
      location,
      matchName,
      attacker,
      defender,
      refresh: () => location.reload(),
      config: computed(() => store.state.config),
    }
  },
})
</script>
