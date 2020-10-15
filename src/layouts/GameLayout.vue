<template>
  <q-layout view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default" style="font-size: 21px" elevated>
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
          <base-btn
            flat
            icon-right="timer"
            dense
            padding="none"
            @click="showTimer"
          >
            <span :class="timerColor">{{ timer }}</span>
          </base-btn>
          <q-dialog v-model="showTimerDetails" position="top">
            <q-card class="page-container" style="margin-top: 50px">
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
        </div>
      </q-toolbar>
      <q-linear-progress v-if="loading" class="absolute" indeterminate />
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
import { formatTimer } from 'src/utils/format'
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
    const showTimerDetails = ref(false)
    const loading = ref(false)
    const timerDescription = ref('')
    const attackerReserve = ref('1m15s')
    const defenderReserve = ref('4h20m')
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
    const isAttacker = computed(
      () => attacker.value == store.state.player.username,
    )
    return {
      showTimerDetails,
      loading,
      timerDescription,
      attackerReserve,
      defenderReserve,
      isAttacker,
      location,
      matchName,
      attacker,
      defender,
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
    }
  },
})
</script>
