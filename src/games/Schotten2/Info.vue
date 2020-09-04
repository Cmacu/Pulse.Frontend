<template>
  <section class="q-pa-sm">
    <div class="full-width text-center q-mb-sm">
      Cmacu turn: <i>Play a card...</i>
    </div>
    <q-space />
    <div>
      <div class="row q-gutter-xs items-center">
        <SchottenCard class="bg-lime-10"
          >6<br />Discard<br />Cards</SchottenCard
        >
        <SchottenCard class="bg-lime-10">22<br />Siege<br />Cards</SchottenCard>
        <SchottenCard class="bg-lime-10"
          >10<br />Tactic<br />Cards</SchottenCard
        >
      </div>
      <div class="text-center">Card Decks</div>
    </div>
    <q-space />
    <div>
      <div class="row q-gutter-xs">
        <SchottenCard class="bg-brown-10">3<br />Oil<br />Cards</SchottenCard>
        <SchottenCard class="bg-brown-10">5<br />Siege<br />Cards</SchottenCard>
        <SchottenCard class="bg-brown-10"
          >1<br />Tactic<br />Cards</SchottenCard
        >
      </div>
      <div class="text-center">WHIZ's Cards</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Info',
  components: {
    SchottenCard: () => import('./Card.vue'),
  },
})
</script>
