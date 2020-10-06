<template>
  <q-page
    class="flex flex-center"
    v-touch-swipe.right="swipeRight"
    v-touch-swipe.left="swipeLeft"
  >
    <div class="page-container row q-pa-sm q-gutter-sm">
      <GameOptions />
      <ProfileStats />
      <MatchMaker />
      <MatchMakerLog />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import router from '../router'
import GameOptions from 'components/GameOptions.vue'
import ProfileStats from 'components/ProfileStats.vue'
import MatchMaker from 'components/MatchMaker.vue'
import MatchMakerLog from 'components/MatchMakerLog.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    GameOptions,
    ProfileStats,
    MatchMaker,
    MatchMakerLog,
  },
  setup() {
    return {
      swipeRight: () => {
        router.push('/leaderboard')
      },
      swipeLeft: () => {
        router.push('/profile')
      },
    }
  },
})
</script>
