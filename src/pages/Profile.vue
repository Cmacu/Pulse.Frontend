<template>
  <q-page v-touch-swipe.right="swipeRight">
    <div class="page-container q-pa-sm">
      <div class="row q-gutter-sm">
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
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from '../store'
import router from 'src/router'
import ProfileInfo from 'components/ProfileInfo.vue'
import MatchHistory from 'components/MatchHistory.vue'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    ProfileInfo,
    MatchHistory,
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
