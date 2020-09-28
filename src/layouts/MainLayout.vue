<template>
  <div v-if="loading" class="flex flex-center fullscreen bg-default">
    <q-spinner-dots size="10em" color="primary" />
  </div>
  <q-layout v-else view="hHh lpR fFf">
    <q-header class="bg-default text-center row" elevated>
      <base-btn flat :icon="config.buttons.menu.icon" @click="toggleMenu" />
      <q-toolbar class="col" style="cursor: pointer;">
        <q-toolbar-title class="top-title">
          <q-avatar class="q-mr-xs" @click="location.href = '/'">
            <img :src="config.icon" />
          </q-avatar>
          <a href="http://pulsegames.io" target="_blank" class="text-white">
            <span>pulse</span>
            <span class="text-primary">games</span>
            <span>.io</span>
            <!-- <span class="text-bold text-primary">&nbsp;{{ config.game }}</span> -->
          </a>
        </q-toolbar-title>
      </q-toolbar>
      <base-btn
        flat
        :icon="config.buttons.settings.icon"
        :to="config.buttons.settings.to"
      />
    </q-header>

    <q-drawer v-model="showMenu" :width="100">
      <div class="flex full-height flex-center">
        <div v-if="$q.screen.gt.sm" class="flex row full-width justify">
          <MenuTabs
            v-model="current"
            :tabs="config.mainTabs"
            class="text-primary bg-default"
            stretch
            vertical
          />
        </div>
        <div class="q-gutter-sm flex row full-width justify-center">
          <base-btn
            v-for="button in config.extraButtons"
            :key="button.label"
            v-bind="button"
            type="a"
            target="_blank"
            flat
            stack
            round
            :color="$q.dark.isActive ? 'info' : 'accent'"
            class="menu-item"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container style="margin-bottom: 50px;">
      <router-view :key="$route.fullPath" />
      <q-page-sticky v-if="showFab" position="bottom-right" :offset="[10, 10]">
        <base-btn
          fab
          v-bind="match"
          @click="toggleMatch"
          label=""
          :class="{ 'rotate-minutes': animate }"
        />
      </q-page-sticky>
    </q-page-container>

    <q-footer elevated class="bg-default text-center">
      <div v-if="$q.screen.lt.md" class="row no-wrap">
        <base-btn
          dense
          flat
          :icon="config.buttons.menu.icon"
          class="q-mx-sm q-my-md"
          @click="toggleMenu"
        />
        <div class="col">
          <MenuTabs
            v-model="current"
            :tabs="config.mainTabs"
            align="justify"
            class="text-primary full-width bottom-tabs"
            stretch
          />
        </div>
        <base-btn
          dense
          flat
          :icon="config.buttons.settings.icon"
          class="q-mx-sm q-my-md"
          :to="config.buttons.settings.to"
        />
      </div>
      <div v-else class="q-ma-md" style="height: 18px;">
        {{ config.name }} @ 2020 - {{ config.game }}
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
import store from '../store/'

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuTabs: () => import('components/MenuTabs.vue'),
  },
  setup() {
    const loading = ref(true)
    const config = computed(() => store.state.config)
    const showMenu = computed({
      get: () => store.state.config.showMenu,
      set: store.dispatch.config.toggleMenu,
    })

    onMounted(async () => {
      store.dispatch.config.resetSettings()
      await store.dispatch.player.updatePlayer()
      loading.value = false
    })

    return {
      loading,
      config,
      showMenu,
      location: window.location,
      current: ref('/'),
      match: computed(() => store.state.matchmaker),
      ...store.dispatch.config,
      toggleMatch: store.dispatch.matchmaker.toggle,
      showFab: computed(() => store.state.settings.showFab),
      animate: computed(
        () =>
          store.state.settings.enableClock &&
          store.state.matchmaker.showSearching,
      ),
    }
  },
})
</script>

<style lang="sass">
.q-page-container
  padding-left: 0px !important;
.q-drawer
  position: fixed
  background: transparent
.mobile .q-drawer
  background: black
.menu-item
  width: 80px
  height: 80px
</style>
