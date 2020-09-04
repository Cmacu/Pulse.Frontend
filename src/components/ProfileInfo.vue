<template>
  <div v-if="loading" class="text-center" style="width: 100%; height: 190px;">
    <q-spinner-dots size="10em" color="primary" />
  </div>
  <div v-else class="player-info justify-start bg-default shadow-2">
    <div class="row justify-center" style="padding-bottom: 15px;">
      <q-icon
        :name="`img:${rank.badge}`"
        class="avatar-info"
        :class="{ 'rotate-seconds': animate }"
        size="100px"
        style="padding-top: 10px; margin-right: -12px; z-index: 99;"
      />
      <base-avatar
        v-bind="player"
        add-border
        hide-badge
        hide-rank
        hide-country
        size="120px"
        class="avatar-info"
      />
      <div
        v-if="player.country"
        style="padding-top: 10px; margin-left: -11px; z-index: 100;"
      >
        <div
          class="avatar-info bg-primary flex flex-center text-dark"
          style="width: 100px; height: 100px; border-radius: 50%;"
          :style="flagBackground"
        />
      </div>
      <div v-else style="padding-top: 10px; margin-left: -11px;">
        <div
          class="avatar-info cog-border-1 bg-primary flex flex-center text-dark"
          :class="rankClass"
          style="width: 100px; height: 100px;"
        >
          <div class="full-width">
            <strong class="text-caps" style="line-height: 0.8;">
              {{ rank.name }}
            </strong>
            <div class="text-caps" style="line-height: 0.8;">
              {{ rank.title }} {{ rank.rank }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <section>
      <div
        class="text-subtitle2 text-primary q-mb-md"
        style="font-size: 3rem !important;"
      >
        {{ player.cgeUsername }}
      </div>
    </section>
    <section>
      <q-btn-group spread class="pulse-stats" flat>
        <base-btn
          v-for="stat in stats"
          :key="stat.label"
          v-bind="stat"
          label=""
          size="lg"
          flat
          stack
        >
          {{ formatNumber(+player[stat.info]) }}</base-btn
        >
      </q-btn-group>
    </section>
    <section v-if="badges.length" class="row justify-center q-gutter-md">
      <base-btn
        v-for="badge of badges"
        :key="badge.name"
        :icon="'img:' + badge.image"
        :tooltip="badge.tooltip"
        flat
        round
        size="40px"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
import api from 'src/utils/api'
import { formatNumber } from 'src/utils/format'
import { PlayerInterface } from 'src/store/modules/player'
import store from 'src/store'
import { DivisionInterface, BadgeDetails } from 'src/store/modules/config'

interface PlayerStats {
  games: number
  wins: number
  resigns: number
  timeouts: number
  culture: number
}

export default defineComponent({
  name: 'PlayerInfo',
  props: {
    playerId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true)
    const player = ref<PlayerInterface>()
    const rank = computed<DivisionInterface>(() =>
      store.getters.config.getDivision(
        player.value?.division,
        player.value?.level,
      ),
    )
    const animate = computed<boolean>(
      () =>
        store.state.settings.enableClock &&
        store.state.matchmaker.showSearching,
    )
    onMounted(async () => {
      const response = await api.getPlayer(props.playerId)
      player.value = response.data
      loading.value = false
    })
    return {
      loading,
      formatNumber,
      player,
      rank,
      animate,
      badges: computed<BadgeDetails[]>(() => {
        const badges: BadgeDetails[] = []
        if (!player.value) return badges
        for (const badge of player.value.badges) {
          badges.push(store.getters.config.getBadgeDetails(badge.name))
        }
        return badges
      }),
      flagBackground: computed<string>(
        () =>
          `background-image: url("/flags/${player.value?.country.toLowerCase()}.svg") !important`,
      ),
      stats: computed(() => store.state.config.stats),
      rankClass: computed(
        () =>
          `bg-${rank.value.color} ` + (animate.value ? 'rotate-minutes' : ''),
      ),
    }
  },
})
</script>

<style lang="sass">
.player-info
  margin-top: 80px
  text-align: center
  width: 100%
  border-radius: 110px 110px 0px 0px
.avatar-info
  margin-top: -60px
</style>
