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
          <span class="text-primary">{{ config.name }}</span>
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
      <div class="q-ma-md">{{ config.name }} @ 2020</div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from '../store/'

export default defineComponent({
  name: 'PublicLayout',
  setup() {
    const config = computed(() => store.state.config)
    return {
      config,
      location: window.location,
    }
  },
})
</script>

<style lang="sass" scoped>
.menu-item
  width: 80px
  height: 80px
</style>
