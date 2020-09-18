<template>
  <q-page class="flex flex-center" v-touch-swipe.right="swipeRight">
    <div class="page-container row q-pa-sm q-gutter-sm">
      <!-- Info -->
      <ProfileInfo :playerId="playerId" />
      <!-- VS History -->
      <MatchHistory
        v-if="!isCurrentPlayer"
        :playerId="playerId"
        :opponentId="opponentId"
        title="Games Against You"
        subtitle="History"
      />
      <!-- Game History -->
      <MatchHistory :playerId="playerId" />
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
    id: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const playerId = computed<string>(() =>
      props.id ? props.id.toString() : store.state.player.id.toString(),
    )
    const opponentId = computed<string>(() =>
      playerId.value != store.state.player.id
        ? store.state.player.id.toString()
        : '',
    )
    return {
      playerId,
      opponentId,
      isCurrentPlayer: computed<boolean>(() => opponentId.value == ''),
      swipeRight: () => {
        router.push('/')
      },
    }
  },
})
</script>
