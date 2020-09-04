<template>
  <q-item clickable v-ripple :class="textClass" :to="`/profile/${player.id}`">
    <q-item-section side style="width: 50px; text-align: right;">
      <div class="full-width text-center text-special-13">{{ position }}</div>
    </q-item-section>
    <q-item-section side>
      <q-icon :name="`img:${division.badge}`" size="50px" />
    </q-item-section>
    <q-item-section side>
      <base-avatar
        v-bind="player"
        :level="position"
        :division="3"
        size="50px"
        hide-badge
        hide-rank
        hide-country
      />
    </q-item-section>
    <q-item-section>
      <q-item-label class="ellipsis text-special-13">
        {{ player.cgeUsername }}
      </q-item-label>
    </q-item-section>
    <q-item-section v-if="$q.screen.gt.xs && player.country" side>
      <div class="rank-flag" :style="flagBackground"></div>
    </q-item-section>
    <q-item-section side>
      <div class="text-special-16 text-default">
        {{ wins }}
      </div>
      <div class="text-special-07 text-default">
        Wins
      </div>
    </q-item-section>
    <!-- <q-item-section side>
      <div class="text-special-16 text-default">{{ winPercent }}%</div>
      <div class="text-special-07 text-default">
        Percent
      </div>
    </q-item-section> -->
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api'
import { PlayerInterface } from '../store/modules/player'
import { DivisionInterface } from 'src/store/modules/config'
import { store } from 'src/store'

export default defineComponent({
  name: 'RankingPlayer',
  props: {
    position: {
      type: Number,
      required: true,
    },
    player: {
      type: Object as PropType<PlayerInterface>,
      required: true,
    },
  },
  setup(props) {
    return {
      textClass: computed<string>(() => {
        if (props.position == 1) return 'text-primary'
        if (props.position == 2) return 'text-info'
        if (props.position == 3) return 'text-secondary'
        return ''
      }),
      flagBackground: computed<string>(
        () =>
          `background-image: url("/flags/${props.player.country?.toLowerCase()}.svg") !important`,
      ),
      winPercent: computed<number>(() => +props.player.winPercent || 0),
      wins: computed<number>(() => props.player.totalWins || 0),
      division: computed<DivisionInterface>(() =>
        store.getters.config.getDivision(
          props.player?.division,
          props.player?.level,
        ),
      ),
    }
  },
})
</script>

<style lang="sass" scoped>
.rank-flag
  width: 45px;
  height: 45px;
</style>
