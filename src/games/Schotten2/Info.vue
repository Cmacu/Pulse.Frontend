<template>
  <section class="q-pa-sm">
    <div class="row justify-between q-pb-sm">
      <div class="text-right">
        Schotten Totten 2 by
        <a href="https://www.knizia.de/" class="text-secondary" target="_blank"
          >Reiner Knizia</a
        >
      </div>
      <div class="text-left">{{ player }} turn</div>
    </div>
    <div class="row">
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
  props: {
    opponent: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    console.error(props)
    const isCurrentPlayer = computed(() => game.state.isCurrentPlayer)
    return {
      player: computed(() =>
        isCurrentPlayer.value ? 'Your' : `${props.opponent}'s`,
      ),
      siegeCardsCount: computed(() => game.state.siegeCardsCount),
      discardCards: computed(() => game.state.discardCards),
      opponentCardsCount: computed(() => game.state.opponentCardsCount),
      oilCount: computed(() => game.state.oilCount),
    }
  },
})
</script>
