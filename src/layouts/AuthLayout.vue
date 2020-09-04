<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-default text-white text-center row">
      <q-toolbar
        class="col"
        style="cursor: pointer;"
        @click="location.href = 'https://pulsegames.io/index.html'"
      >
        <q-toolbar-title class="top-title">
          <q-avatar class="q-mr-md">
            <img :src="settings.projectIcon" />
          </q-avatar>
          <span>{{ titleGame }}</span>
          <span class="text-bold text-primary"
            >&nbsp;{{ settings.projectName }}</span
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-default text-center text-white"
      style="border-top: 1px solid #111;"
    >
      <div class="q-ma-md">
        {{ settings.gameName }} {{ settings.projectName }} @ 2020
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import store from '../store/'
import { Screen } from 'quasar'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const settings = computed(() => store.state.config)
    return {
      settings,
      location: window.location,
      titleGame: computed(() =>
        Screen.gt.sm ? settings.value.gameName : settings.value.gameNameShort,
      ),
      current: ref('/'),
    }
  },
})
</script>

<style lang="sass" scopped>
.menu-item
  width: 80px
  height: 80px
</style>
