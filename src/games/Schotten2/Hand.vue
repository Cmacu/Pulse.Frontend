<template>
  <Container
    orientation="horizontal"
    class="bg-transparent row justify-evenly"
    style="display: flex;"
    :drag-begin-delay="1"
    @drop="atHandDrop"
    @drag-start="atDragCard"
    drag-class="card-ghost"
    drop-class="card-ghost-drop"
    :get-child-payload="getChildPayload"
  >
    <Draggable v-for="(cardIndex, orderIndex) in handOrder" :key="orderIndex">
      <Card
        v-if="handCards[cardIndex]"
        v-bind="handCards[cardIndex]"
        class="bg-default"
        :class="{ 'new-card': orderIndex < newCards }"
        :selected="selectedCard == cardIndex"
        @click="atCardClick(cardIndex)"
      >
        <div
          class="row q-gutter items-center justify-between"
          :class="`text-${suits[handCards[cardIndex].suit].color}`"
        >
          <div>{{ handCards[cardIndex].rank }}</div>
          <q-icon :name="suits[handCards[cardIndex].suit].icon" />
        </div>
      </Card>
    </Draggable>
  </Container>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { suits } from './design'
import { game } from './game'
import { Container, Draggable, DropResult } from 'vue-smooth-dnd'

export default defineComponent({
  name: 'Hand',
  components: {
    Container,
    Draggable,
    Card: () => import('./Card.vue'),
  },
  setup() {
    return {
      suits,
      newCards: computed(() => game.state.api.newCards),
      handOrder: computed(() => game.state.handOrder),
      handCards: computed(() => game.state.api.handCards),
      isAttacker: computed(() => game.state.api.isAttacker),
      enablePreparation: computed(() => game.state.api.enablePreparation),
      selectedCard: computed(() => game.state.selectedCard),
      atDragCard: game.actions.dragCard,
      atCardClick: game.actions.toggleCard,
      getChildPayload: (orderIndex: number) => game.state.handOrder[orderIndex],
      atHandDrop: (dropResult: DropResult) => {
        game.actions.shuffleHand(dropResult.removedIndex, dropResult.addedIndex)
      },
    }
  },
})
</script>
