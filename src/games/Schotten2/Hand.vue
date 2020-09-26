<template>
  <Container
    orientation="horizontal"
    class="bg-transparent row justify-evenly"
    style="display: flex;"
    @drop="atHandDrop"
    @drag-start="atDragCard"
    drag-class="card-ghost"
    drop-class="card-ghost-drop"
    :get-child-payload="getChildPayload"
  >
    <Draggable v-for="(cardIndex, orderIndex) in handOrder" :key="orderIndex">
      <SiegeCard
        v-if="handCards[cardIndex]"
        v-bind="handCards[cardIndex]"
        :class="{ 'new-card': orderIndex < newCards }"
        :selected="handOrderSelectedIndex == orderIndex"
        @click="atCardClick(orderIndex)"
      />
    </Draggable>
  </Container>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { suits } from './design'
import { game } from './game'
import { Container, Draggable, DropResult } from 'vue-smooth-dnd'

export default defineComponent({
  name: 'Hand',
  components: {
    Container,
    Draggable,
    SiegeCard: () => import('./SiegeCard.vue'),
  },
  setup() {
    const hideImages = ref<boolean[]>([])
    return {
      hideImages,
      suits,
      newCards: computed(() => game.state.api.newCards),
      handOrder: computed(() => game.state.handOrder),
      handCards: computed(() => game.state.api.handCards || []),
      enablePreparation: computed(() => game.state.api.enablePreparation),
      handOrderSelectedIndex: computed(() => game.state.handOrderSelectedIndex),
      atDragCard: game.actions.dragCard,
      atCardClick: game.actions.toggleCard,
      getChildPayload: (orderIndex: number) => orderIndex,
      atHandDrop: (dropResult: DropResult) => {
        if (dropResult == null) return
        const { removedIndex, addedIndex } = dropResult
        if (removedIndex == null || addedIndex == null) return
        hideImages.value[removedIndex] = true
        hideImages.value[addedIndex] = true
        game.actions.shuffleHand(removedIndex, addedIndex)
        // Vue.nextTick(() => {
        //   hideImages.value = []
        // })
        setTimeout(() => {
          hideImages.value = []
        }, 1)
      },
    }
  },
})
</script>
