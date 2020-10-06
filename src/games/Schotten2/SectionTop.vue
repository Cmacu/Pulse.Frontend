<template>
  <div
    class="flex column items-center"
    style="margin-bottom: -42%;"
    :class="{ 'enable-oil': enableOil }"
    @click="atUseOil(sectionIndex)"
  >
    <SiegeCard
      v-for="(card, cardIndex) in cards"
      :key="cardIndex"
      v-bind="card"
      style="margin-top: -80%;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { suits } from './design'
import { game, Schotten2Section } from './game'
import SiegeCard from './SiegeCard.vue'

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
    SiegeCard,
  },
  setup(props) {
    const cards = computed(() => {
      if (!props.section) return []
      const formation = game.state.api.isAttacker
        ? props.section.defense
        : props.section.attack
      if (!formation) return []
      return [...formation.reverse()]
    })
    return {
      suits,
      cards,
      enableOil: computed(() => {
        if (!game.state.api.isCurrentPlayer) return false
        if (!game.state.enableOil) return false
        if (cards.value.length == 0) return false
        if (cards.value[0].protected) return false
        return true
      }),
      atUseOil: game.actions.useOil,
    }
  },
})
</script>
