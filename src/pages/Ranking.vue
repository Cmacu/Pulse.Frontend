<template>
  <q-page class="flex flex-center" v-touch-swipe.left="swipeLeft">
    <div class="page-container row q-pa-sm q-gutter-sm">
      <!-- Ranking -->
      <base-card
        :icon="ranking.icon"
        :title="projectName + ' ' + ranking.label"
        subtitle="Season I: The Age of Competition (July 18 - Sep 30 2020)"
        :loading="loading"
      >
        <template slot="extra">
          <base-btn v-bind="rankingHelp" flat round />
        </template>
        <div
          v-if="loading"
          class="text-center"
          style="width: 100%; height: 190px;"
        >
          <q-spinner-dots size="10em" color="primary" />
        </div>
        <q-list v-else class="stripped">
          <RankingPlayer
            v-for="(player, pos) in leaderboard"
            :key="player.id"
            :position="startPosition + pos + 1"
            :player="player"
          />
          <q-item v-if="noResults && !loading">
            <q-item-section class="q-pa-md text-center">
              No results found.
            </q-item-section>
          </q-item>
          <q-item v-else class="flex flex-center">
            <q-pagination
              :value="page"
              :max="totalPages"
              :input="true"
              @input="onPageChange"
            />
          </q-item>
        </q-list>
      </base-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
import { PlayerInterface } from '../store/modules/player'
import store from '../store'
import router from 'src/router'
import api from 'src/utils/api'

export default defineComponent({
  name: 'RankingPage',
  components: {
    RankingPlayer: () => import('components/RankingPlayer.vue'),
  },
  setup() {
    const page = computed(
      () => store.state.config.leaderboardConfig.currentPage,
    )
    const pageSize = computed(
      () => store.state.config.leaderboardConfig.pageSize,
    )
    const totalPages = ref(3)
    const loading = ref(true)
    const leaderboard = ref<Array<PlayerInterface>>([])

    const getLeaderboardPage = async () => {
      loading.value = true
      const skip = (page.value - 1) * pageSize.value
      const response = await api.getLeaderboard(skip, pageSize.value)
      totalPages.value = Math.ceil(
        +response.data.total / (+pageSize.value ?? 1),
      )
      leaderboard.value = response.data.results
      loading.value = false
    }

    onMounted(getLeaderboardPage)

    const onPageChange = (newPage: number) => {
      store.dispatch.config.updateLeaderboardPage(newPage)
      getLeaderboardPage()
    }

    return {
      page,
      totalPages,
      startPosition: computed(() => (page.value - 1) * pageSize.value),
      loading,
      projectName: computed(() => store.state.config.projectName),
      ranking: computed(() => store.state.config.buttons.ranking),
      rankingHelp: computed(() => store.state.config.buttons.rankingHelp),
      leaderboard,
      noResults: computed(() => page.value == 1 && !leaderboard.value.length),
      onPageChange,
      swipeLeft: () => {
        router.push('/')
      },
    }
  },
})
</script>
