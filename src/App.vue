<template>
  <div id="q-app">
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
