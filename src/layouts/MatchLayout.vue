<template>
  <div v-if="loading" class="flex flex-center fullscreen bg-default">
    <q-spinner-dots size="10em" color="primary" />
  </div>
  <q-layout v-else view="hHr lpr lFr" class="match-layout">
    <q-header class="bg-default shadow-6">
      <div class="q-pa-sm row">
        <div class="col">
          <div class="row no-wrap">
            <q-avatar class="q-mr-sm" size="1.25rem">
              <img :src="config.projectIcon" />
            </q-avatar>
            <div class="ellipsis">
              <span>Pulse {{ matchId }}</span
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
          <strong>Cmacu</strong>
          <q-icon name="clear" size="1rem" />
          <span>WHIZ</span>
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
      <router-view :key="$route.fullPath" :matchId="matchId" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from 'src/store'

export default defineComponent({
  name: 'MatchLayout',
  setup() {
    return {
      loading: computed(() => store.state.match.loading),
      matchId: computed(() => store.state.match.name),
      config: computed(() => store.state.config),
    }
  },
})
</script>

<style lang="sass">
html
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
