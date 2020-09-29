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
import { defineComponent, computed } from '@vue/composition-api'
import store from 'src/store'

export default defineComponent({
  name: 'GameLayout',
  props: {
    matchId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return {
      attacker: props.matchId == 0 ? 'General' : 'Attacker',
      defender: props.matchId == 0 ? 'General' : 'Defender',
      config: computed(() => store.state.config),
    }
  },
})
</script>
