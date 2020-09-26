<template>
  <section class="row justify-between q-pa-sm" :class="{ reverse: isAttacker }">
    <InfoCard name="siege" :counter="siegeCardsCount" />
    <InfoCard name="help" :counter="0" />
    <InfoCard name="discard" :counter="discardCount" />
    <InfoCard name="oil" :counter="oilCount" />
    <InfoCard name="opponent" :counter="opponentCardsCount" />
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { game } from './game'

export default defineComponent({
  name: 'Info',
  components: {
    InfoCard: () => import('./InfoCard.vue'),
  },
  setup() {
    const discardCards = computed(() => game.state.api.discardCards || [])
    const discardCount = computed(
      () => game?.state?.api?.discardCards?.length || 0,
    )
    return {
      discardCards,
      discardCount,
      isAttacker: computed(() => game.state.api.isAttacker),
      lastDiscardCard: computed(() =>
        discardCount.value ? discardCards.value[discardCount.value - 1] : null,
      ),
      siegeCardsCount: computed(() => game.state.api.siegeCardsCount || 0),
      opponentCardsCount: computed(
        () => game.state.api.opponentCardsCount || 0,
      ),
      oilCount: computed(() => game.state.api.oilCount || 0),
    }
  },
})
</script>
