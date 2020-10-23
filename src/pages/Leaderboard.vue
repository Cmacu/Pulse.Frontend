<template>
  <q-page class="flex flex-center" v-touch-swipe.left="swipeLeft">
    <div class="page-container row q-pa-sm q-gutter-sm">
      <!-- Leaderboard -->
      <base-card
        :icon="leaderboard.icon"
        :title="game + ' ' + leaderboard.label"
        subtitle="Winter 20 (Oct 1 - Dec 31)"
        :loading="loading"
      >
        <template slot="extra">
          <base-btn v-bind="leaderboardHelp" flat round />
        </template>
        <div
          v-if="loading"
          class="text-center"
          style="width: 100%; height: 710px"
        >
          <q-spinner-dots size="10em" color="primary" />
        </div>
        <q-list v-else class="stripped" style="height: 710px">
          <q-item>
            <q-item-section side>
              <q-select
                v-model="search"
                use-input
                hide-selected
                fill-input
                input-debounce="100"
                :options="options"
                @filter="filterFn"
                @input="onPlayerInput"
                :loading="searchLoading"
                style="width: 170px"
                placeholder="Player search"
                dense
                clearable
                hide-dropdown-icon
                filled
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <div class="text-overline" style="line-height: 1.1rem">
                Last Updated:
              </div>
              <div class="text-overline" style="line-height: 1.1rem">
                {{ lastUpdated }}
              </div>
            </q-item-section>
          </q-item>
          <LeaderboardRow
            v-for="(player, pos) in leaderboardPlayers"
            :key="pos"
            :position="startPosition + pos + 1"
            :player="player"
          />
        </q-list>
        <q-list>
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
import { LeaderboardPlayer } from '../store/modules/config'
import store from '../store'
import router from 'src/router'
import api from 'src/utils/api'
import LeaderboardRow from 'components/LeaderboardRow.vue'
import date from 'src/utils/date'

export default defineComponent({
  name: 'LeaderboardPage',
  components: {
    LeaderboardRow,
  },
  setup() {
    const page = computed(
      () => store.state.config.leaderboardConfig.currentPage,
    )
    const pageSize = computed(
      () => store.state.config.leaderboardConfig.pageSize,
    )
    const totalPages = ref(3)
    const lastUpdated = ref('')
    const loading = ref(true)
    const searchLoading = ref(false)
    const leaderboardPlayers = ref<Array<LeaderboardPlayer>>([])
    const options = ref<string[]>([])
    const players = ref<string[]>([])

    const getLeaderboardPage = async () => {
      loading.value = true
      const skip = (page.value - 1) * pageSize.value
      const response = await api.getLeaderboard(skip, pageSize.value)
      totalPages.value = Math.ceil(
        +response.data.total / (+pageSize.value ?? 1),
      )
      lastUpdated.value = date.utc(response.data.createdAt).local().calendar()
      leaderboardPlayers.value = response.data.results
      players.value = []
      leaderboardPlayers.value.forEach((leader) =>
        players.value.push(leader.username),
      )
      loading.value = false
    }

    onMounted(getLeaderboardPage)

    const onPageChange = (newPage: number) => {
      store.dispatch.config.updateLeaderboardPage(newPage)
      getLeaderboardPage()
    }

    return {
      search: ref(''),
      options,
      searchLoading,
      page,
      totalPages,
      lastUpdated,
      players,
      startPosition: computed(() => (page.value - 1) * pageSize.value),
      loading,
      game: computed(() => store.state.config.game),
      leaderboard: computed(() => store.state.config.buttons.leaderboard),
      leaderboardHelp: computed(
        () => store.state.config.buttons.leaderboardHelp,
      ),
      leaderboardPlayers,
      noResults: computed(
        () => page.value == 1 && !leaderboardPlayers.value.length,
      ),
      onPageChange,
      filterFn(val: string, update: Function, abort: Function) {
        if (val.length < 2) {
          abort()
          return
        }

        update(async () => {
          searchLoading.value = true
          const needle = val.toLowerCase()
          const response = await api.findPlayer(needle)
          options.value = response.data
          searchLoading.value = false
        })
      },
      onPlayerInput: (val: string) => router.push(`/profile/${val}`),
      swipeLeft: () => {
        router.push('/')
      },
    }
  },
})
</script>
