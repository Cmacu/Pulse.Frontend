<template>
  <section class="row justify-between q-pa-sm" :class="{ reverse: isAttacker }">
    <InfoCard name="siege" :counter="siegeCardsCount" />

    <InfoCard name="help" @click="showHelp = true" />
    <q-dialog v-model="showHelp" auto-close>
      <Rules />
    </q-dialog>

    <InfoCard
      name="discard"
      :counter="discardCount"
      @click="showDiscard = true"
    />
    <q-dialog v-model="showDiscard" auto-close>
      <q-card class="page-container q-pa-md">
        <q-card-section title>
          <div class="text-special-13 text-center">DISCARD CARDS</div>
        </q-card-section>
        <q-separator class="q-mb-md" inset />
        <table class="schotten2-discards">
          <tr v-for="rank in ranks" :key="rank">
            <td v-for="(suit, suitIndex) in suits" :key="suitIndex">
              <div
                class="row justify-center items-end"
                :class="{ faded: !isDiscard(suitIndex, rank) }"
              >
                <div
                  class="col text-right"
                  :style="{
                    color: suit.color,
                  }"
                >
                  {{ rank }}
                </div>
                <div class="col text-left" :style="{ 'padding-bottom': '2px' }">
                  <q-img
                    :src="`/st2/symbols/${suitIndex}.png`"
                    height="1rem"
                    contain
                  />
                </div>
              </div>
            </td>
          </tr>
        </table>
      </q-card>
    </q-dialog>

    <InfoCard name="oil" :counter="oilCount" />

    <InfoCard name="opponent" :counter="opponentCardsCount" />
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { suits } from './design'
import { game } from './game'

export default defineComponent({
  name: 'Info',
  components: {
    InfoCard: () => import('./InfoCard.vue'),
    Rules: () => import('./Rules.vue'),
  },
  setup() {
    const showDiscard = ref(false)
    const showHelp = ref(false)
    const discardCards = computed(() => game.state.api.discardCards || [])
    const discardCount = computed(
      () => game?.state?.api?.discardCards?.length || 0,
    )
    const ranks: number[] = []
    for (let i = 0; i < 12; i++) ranks.push(i)
    return {
      ranks,
      suits,
      showDiscard,
      showHelp,
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
      isDiscard: (suit: number, rank: number) => {
        if (!discardCards) return false
        const card = discardCards.value.find(
          (x) => x.suit == suit && x.rank == rank,
        )
        return !!card
      },
    }
  },
})
</script>
