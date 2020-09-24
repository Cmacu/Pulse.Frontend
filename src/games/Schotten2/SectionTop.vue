<template>
  <div
    class="flex column items-center"
    style="margin-bottom: -25%;"
    :class="{ 'enable-oil': enableOil }"
    @click="atUseOil(sectionIndex)"
  >
    <Card
      v-for="(card, cardIndex) in cards"
      :key="cardIndex"
      style="margin-top: -80%;"
      class="bg-brown-10 flex items-end"
    >
      <div
        class="row full-width q-gutter items-center justify-between"
        :class="`text-${suits[card.suit].color}`"
      >
        <div>{{ card.rank }}</div>
        <q-icon :name="suits[card.suit].icon" />
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { suits } from './design'
import { game, Schotten2Section } from './game'

export default defineComponent({
  name: 'SectionTop',
  props: {
    section: {
      type: Object as PropType<Schotten2Section>,
      required: true,
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
  },
  components: {
    Card: () => import('./Card.vue'),
  },
  setup(props) {
    const cards = computed(() => {
      if (!props.section) return []
      const formation = game.state.api.isAttacker
        ? props.section.defense
        : props.section.attack
      if (!formation) return []
      return formation.reverse()
    })
    return {
      suits,
      cards,
      enableOil: computed(() => {
        if (!game.state.api.isCurrentPlayer) return false
        if (!game.state.enableOil) return false
        return cards.value.length > 0
      }),
      atUseOil: game.actions.useOil,
    }
  },
})
</script>
