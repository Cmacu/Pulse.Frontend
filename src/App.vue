<template>
  <div id="q-app">
    <div
      v-if="$q.loading.isActive"
      class="loading-screen q-pa-xl text-center"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import store from './store'
import { Dark } from 'quasar'

export default defineComponent({
  name: 'PulseApp',
  setup() {
    onMounted(() => {
      const isDark = store.state.settings.isDark
      Dark.set(isDark)
    })
    return {}
  },
})
</script>

<style lang="sass" scoped>
.loading-screen
  position: fixed
  top: 0px
  left: 0px
  right: 0px
  bottom: 0px
  background-color: $dark-page
  background-image: url('/logo.png')
  background-position: 50% 33%
  background-size: 67%;
  background-repeat: no-repeat
</style>
