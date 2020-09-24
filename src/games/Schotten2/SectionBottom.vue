<template>
  <div
    class="flex column items-center"
    :class="{ 'enable-retreat': enableRetreat }"
    @click="atRetreat(sectionIndex)"
    style="margin-top: -15%;"
  >
    <Card
      v-for="(card, cardIndex) in cards"
      :key="cardIndex"
      style="margin-bottom: -75%;"
      class="bg-grey-9"
    >
      <div
        class="row q-gutter items-center justify-between"
        :class="`text-${suits[card.suit].color}`"
      >
        <div>{{ card.rank }}</div>
        <q-icon :name="suits[card.suit].icon" />
      </div>
    </Card>
    <Container
      v-if="enableDropZone"
      class="drop-zone-active"
      behaviour="drop-zone"
      :should-accept-drop="() => true"
      @drop="(dropResult) => atWallDrop(sectionIndex, dropResult)"
    >
      <q-card class="drop-zone" flat @click="atDropZoneClick(sectionIndex)" />
    </Container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { suits } from './design'
import { game, Schotten2Section } from './game'
import { Container, DropResult } from 'vue-smooth-dnd'

export default defineComponent({
  name: 'SectionBottom',
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
    Container,
    Card: () => import('./Card.vue'),
  },
  setup(props) {
    const isCurrentPlayer = computed(() => game.state.api.isCurrentPlayer)
    const selectedCard = computed(() => game.state.selectedCard)
    const cards = computed(() => {
      if (!props.section) return []
      const formation = game.state.api.isAttacker
        ? props.section.attack
        : props.section.defense
      return formation || []
    })
    return {
      // necessary for vetur interpolation
      dropResult: {
        addedIndex: 0,
        removedIndex: 0,
        payload: null,
        element: Element.prototype,
      },
      isCurrentPlayer,
      enableRetreat: computed(() => game.state.enableRetreat),
      enableDropZone: computed(() => {
        if (!isCurrentPlayer.value) return false
        if (selectedCard.value < 0) return false
        if (game.state.enableRetreat) return false
        if (game.state.enableOil) return false
        return props.section.spaces > cards.value.length
      }),
      spaces: computed(() => props.section.spaces),
      suits,
      cards,
      atDropZoneClick: (sectionIndex: number) => {
        if (selectedCard.value < 0) return
        return game.actions.addCardToWall(
          sectionIndex,
          game.state.handOrder[selectedCard.value],
        )
      },
      atWallDrop: (sectionIndex: number, dropResult: DropResult) => {
        if (dropResult.addedIndex == null) return
        if (typeof dropResult.payload != 'number') return
        return game.actions.addCardToWall(sectionIndex, dropResult.payload)
      },
      atRetreat: game.actions.retreat,
    }
  },
})
</script>
