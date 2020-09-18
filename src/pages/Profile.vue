<template>
  <q-page class="flex flex-center" v-touch-swipe.right="swipeRight">
    <div class="page-container row q-pa-sm q-gutter-sm">
      <!-- Info -->
      <ProfileInfo :player="player" />
      <!-- VS History -->
      <MatchHistory
        v-if="!isCurrentPlayer"
        :player="player"
        :opponent="opponent"
        title="Games Against You"
        subtitle="History"
      />
      <!-- Game History -->
      <MatchHistory :player="player" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from '../store'
import router from 'src/router'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    ProfileInfo: () => import('components/ProfileInfo.vue'),
    ProfileChord: () => import('components/ProfileChord.vue'),
    MatchHistory: () => import('components/MatchHistory.vue'),
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const player = computed<string>(() =>
      props.name ? props.name : store.state.player.username,
    )
    const opponent = computed<string>(() =>
      player.value != store.state.player.username
        ? store.state.player.username
        : '',
    )
    return {
      player,
      opponent,
      isCurrentPlayer: computed<boolean>(() => opponent.value == ''),
      swipeRight: () => {
        router.push('/')
      },
    }
  },
})
</script>
