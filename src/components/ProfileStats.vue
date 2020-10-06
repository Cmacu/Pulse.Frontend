<template>
  <base-card
    :icon="buttons.profile.icon"
    :title="player.username"
    :loading="stats.loading"
    :subtitle="decayMessage"
  >
    <template slot="extra">
      <base-btn
        type="a"
        flat
        round
        icon="help_outline"
        href="https://ttapulse.com/the-rating-system.html"
      />
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
      <q-card-section
        v-if="player.division == '3'"
        vertical
        class="col q-pa-none"
      >
        <q-card-section>
          <ProfileTrends
            area-name="Rating"
            :area-total="currentRating"
            :area-data="stats.ratingTrends"
            line-name="With Decay"
            :line-total="withDecay"
            :line-data="stats.decayTrends"
            period="Current"
          />
        </q-card-section>
        <q-card-section>
          <ProfileTrends
            area-name="Matches"
            :area-total="totalMatches"
            :area-data="stats.matchTrends"
            line-name="Wins"
            :line-total="totalWins"
            :line-data="stats.winTrends"
          />
        </q-card-section>
      </q-card-section>
      <q-card-section v-else vertical class="col q-pa-none">
        <q-card-section>
          <ProfileTrends
            area-name="Matches"
            :area-total="totalMatches"
            :area-data="stats.matchTrends"
          />
        </q-card-section>
        <q-card-section>
          <ProfileTrends
            area-name="Wins"
            :area-total="totalWins"
            :area-data="stats.winTrends"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import store from '../store'
import { DivisionInterface } from 'src/store/modules/config'
import ProfileTrends from 'components/ProfileTrends.vue'

export default defineComponent({
  name: 'ProfileStats',
  components: {
    ProfileTrends,
  },
  setup() {
    const player = computed(() => store.state.player)
    const stats = computed(() => store.state.stats)
    const totalMatches = computed(() => store.getters.stats.getTotalMatches)
    const totalWins = computed(() => store.getters.stats.getTotalWins)
    const currentRating = computed(() =>
      Math.round(
        store.state.player.conservativeRating - store.state.player.totalDecay,
      ),
    )
    const totalDecay = computed(() => store.state.player.totalDecay)
    const withDecay = computed(() => totalDecay.value + currentRating.value)
    const regainDecay = computed(() => store.state.player.regainDecay)

    return {
      player,
      stats,
      totalMatches,
      totalWins,
      currentRating,
      totalDecay,
      regainDecay,
      withDecay,
      decayMessage: computed(() => {
        if (+player.value?.division < 3) return 'Personal Stats'
        if (totalDecay.value == 0) return 'Recently active'
        return `
          <span class='text-negative'>
            You lost <strong>${totalDecay.value}</strong> rating points due to inactivity.
          </span>
          <span class='text-positive'>
            Find a match to regain <strong>${regainDecay.value}</strong> points on your next win.
          </span>
        `
      }),
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
