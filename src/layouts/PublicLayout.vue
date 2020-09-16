<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-default text-white text-center row">
      <q-toolbar
        class="col"
        style="cursor: pointer;"
        @click="location.href = 'https://pulsegames.io/index.html'"
      >
        <q-toolbar-title class="top-title">
          <q-avatar class="q-mr-xs">
            <img :src="config.icon" />
          </q-avatar>
          <span class="text-bold text-primary">{{ title }}</span>
          <span>&nbsp;{{ config.game }}</span>
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
      <div class="q-ma-md">{{ config.name }} @ 2020 - {{ config.game }}</div>
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
    const config = computed(() => store.state.config)
    return {
      config,
      location: window.location,
      title: computed(() =>
        Screen.gt.sm ? config.value.name : config.value.nameShort,
      ),
      current: ref('/'),
    }
  },
})
</script>

<style lang="sass" scoped>
.menu-item
  width: 80px
  height: 80px
</style>
