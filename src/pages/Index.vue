<template>
  <q-page
    class="flex flex-center"
    v-touch-swipe.right="swipeRight"
    v-touch-swipe.left="swipeLeft"
  >
    <div class="page-container row q-pa-sm q-gutter-sm">
      <ProfileStats />
      <MatchMaker />
      <MatchMakerLog />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import router from '../router'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ProfileStats: () => import('components/ProfileStats.vue'),
    MatchMaker: () => import('components/MatchMaker.vue'),
    MatchMakerLog: () => import('components/MatchMakerLog.vue'),
  },
  setup() {
    return {
      swipeRight: () => {
        router.push('/ranking')
      },
      swipeLeft: () => {
        router.push('/profile')
      },
    }
  },
})
</script>
