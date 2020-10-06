<template>
  <div
    class="col q-pa-sm bg-white shadow-2 cursor-pointer q-mr-sm"
    @click="atLogClick"
  >
    <div id="schotten2-log">
      <LogItem
        v-if="lastLog && lastLog.description"
        v-bind="lastLog"
        :player="player"
        :align-center="true"
      />
      <div v-else>Log</div>
    </div>
    <q-dialog
      v-model="showLog"
      id="log-dialog"
      position="top"
      full-width
      @before-hide="atBeforeHide"
    >
      <q-card style="font-size: 0.6rem; max-height: 10rem;" square>
        <q-card-section class="row q-py-xs items-center">
          <div>Game Log</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator inset />

        <q-card-section
          class="q-py-xs"
          style="height: 4.5rem; overflow-y: auto;"
        >
          <q-list dense>
            <q-item
              v-for="(log, index) in logList"
              :key="index"
              class="q-pa-none"
              style="padding: 0px !important; min-height: 1rem;"
              clickable
              :id="`log-item-${index}`"
              :class="{ 'bg-black': index == currentLog }"
              :disable="index == currentLog"
              @click="loadLog(index)"
              manual-focus
              :focused="index == currentLog"
            >
              <LogItem v-bind="log" :is-current="index == currentLog" />
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions class="q-py-xs" align="between">
          <q-btn
            flat
            size="0.6rem"
            label="Prev"
            :disable="disablePrev"
            icon="arrow_left"
            @click="loadLog(currentLog - 1)"
          />
          <q-btn flat size="0.6rem" icon="close" v-close-popup />
          <q-btn
            flat
            size="0.6rem"
            label="Next"
            :disable="disableNext"
            icon-right="arrow_right"
            @click="loadLog(currentLog + 1)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { game, Schotten2Log, Schotten2State } from './game'
import { suits } from './design'
import api from 'src/utils/api'

export default defineComponent({
  name: '',
  components: {
    LogItem: () => import('./LogItem.vue'),
  },
  props: {
    attacker: {
      type: String,
      required: true,
    },
    defender: {
      type: String,
      required: true,
    },
    matchId: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const showLog = ref(false)
    const logList = ref<Schotten2Log[]>([])
    const logCount = ref(0)
    const currentLog = ref(0)
    const lastLog = computed(() => game.state.log[game.state.log.length - 1])
    const logStates = ref<Schotten2State[]>([])

    const focusLogItem = (index: number) => {
      setTimeout(() => {
        const el = document.getElementById('log-item-' + index)
        el?.scrollIntoView(false)
      }, 100)
    }

    const displayLog = () => {
      currentLog.value = logCount.value - 1
      showLog.value = true
      focusLogItem(currentLog.value)
    }
    return {
      currentLog,
      showLog,
      lastLog,
      disablePrev: computed(() => currentLog.value <= 0),
      disableNext: computed(
        () => currentLog.value >= logStates.value.length - 1,
      ),
      suits,
      player: computed(() =>
        lastLog.value?.role == '0' ? props.attacker : props.defender,
      ),
      logList,
      atLogClick: async () => {
        if (isNaN(+props.matchId)) {
          logList.value = game.state.log
          return displayLog()
        }
        const response = await api.getSchotten2Log(
          props.matchId,
          logCount.value,
        )
        const apiLogs = response.data
        for (const apiLog of apiLogs) {
          const log = game.actions.parseLog(apiLog, apiLog)
          if (!log) continue
          logStates.value.push(apiLog)
          log.player = log.role == '0' ? props.attacker : props.defender
          logList.value.push(log)
        }
        logCount.value += apiLogs.length
        displayLog()
      },
      loadLog: (index: number) => {
        if (isNaN(+props.matchId)) return
        if (index < 0) return
        if (index >= logStates.value.length) return
        const state = logStates.value[index]
        game.actions.loadLog(state)
        currentLog.value = index
        focusLogItem(index)
      },
      atBeforeHide: game.actions.restoreState,
    }
  },
})
</script>
