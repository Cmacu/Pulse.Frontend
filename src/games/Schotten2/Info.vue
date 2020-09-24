<template>
  <section class="row q-px-sm">
    <div>
      <!-- <div class="text-center">Card Decks</div> -->
      <div class="row q-gutter-xs items-center">
        <Card class="bg-lime-10"
          >{{ discardCards.length }}<br />Discard<br />Cards</Card
        >
        <Card class="bg-lime-10"
          >{{ siegeCardsCount }}<br />Siege<br />Cards</Card
        >
        <!-- <Card class="bg-lime-10"
            >10<br />Tactic<br />Cards</Card
          > -->
      </div>
    </div>
    <q-space />
    <div>
      <!-- <div class="text-center">Help</div> -->
      <Card class="bg-light-blue-10 flex flex-center"> ??<br />Form.. </Card>
    </div>
    <q-space />
    <div>
      <!-- <div class="text-center">WHIZ's Cards</div> -->
      <div class="row q-gutter-xs">
        <Card class="bg-brown-10">{{ oilCount }}<br />Oil<br />Cards</Card>
        <Card class="bg-brown-10"
          >{{ opponentCardsCount }}<br />Opponent<br />Cards</Card
        >
        <!-- <Card class="bg-brown-10"
            >1<br />Tactic<br />Cards</Card
          > -->
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { game } from './game'

export default defineComponent({
  name: 'Info',
  components: {
    Card: () => import('./Card.vue'),
  },
  setup() {
    return {
      siegeCardsCount: computed(() => game.state.api.siegeCardsCount),
      discardCards: computed(() => game.state.api.discardCards),
      opponentCardsCount: computed(() => game.state.api.opponentCardsCount),
      oilCount: computed(() => game.state.api.oilCount),
    }
  },
})
</script>
