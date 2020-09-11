<template>
  <base-card
    :icon="buttons.profile.icon"
    :title="player.username"
    :loading="stats.loading"
    subtitle="Recent Stats"
  >
    <template slot="extra">
      <base-btn flat round :icon="buttons.link.icon" to="/profile" />
    </template>
    <q-card-section horizontal>
      <q-card-section class="col-5 col-sm-3 flex flex-center text-center">
        <div
          class="text-overline text-caps full-width"
          :class="`text-${rank.color}`"
        >
          {{ rank.name }} {{ rank.title }} {{ rank.rank }}
        </div>
        <div class="full-width">
          <q-icon :name="`img:${rank.badge}`" size="110px" />
        </div>
        <div class="text-info text-overline text-caps">
          {{ winPercent }}% WIN RATE
        </div>
      </q-card-section>
      <q-card-section vertical class="col q-pa-none">
        <q-card-section>
          <ProfileTrends
            name="Matches"
            :total="totalMatches"
            :data="stats.matchTrends"
          />
        </q-card-section>
        <q-card-section>
          <ProfileTrends
            name="Wins"
            :total="totalWins"
            :data="stats.winTrends"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import store from '../store'
import { DivisionInterface } from 'src/store/modules/config'

export default defineComponent({
  name: 'ProfileStats',
  components: {
    ProfileTrends: () => import('components/ProfileTrends.vue'),
  },
  setup() {
    onMounted(store.dispatch.stats.getHistory)
    const player = computed(() => store.state.player)
    const stats = computed(() => store.state.stats)
    const totalMatches = computed(() => store.getters.stats.getTotalMatches)
    const totalWins = computed(() => store.getters.stats.getTotalWins)
    return {
      player,
      stats,
      totalMatches,
      totalWins,
      winPercent: computed(() =>
        totalMatches.value > 0
          ? Math.round((totalWins.value / totalMatches.value) * 100)
          : 0,
      ),
      buttons: computed(() => store.state.config.buttons),
      rank: computed<DivisionInterface>(() =>
        store.getters.config.getDivision(
          player.value.division,
          player.value.level,
        ),
      ),
    }
  },
})
</script>

<style lang="sass" scoped></style>
