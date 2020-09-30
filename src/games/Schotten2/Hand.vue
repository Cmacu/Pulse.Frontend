<template>
  <div class="row justify-between">
    <Container
      orientation="horizontal"
      class="bg-transparent row justify-evenly items-end"
      style="display: flex;"
      :drag-begin-delay="$q.platform.is.mobile ? 5 : 0"
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
          :selected="handOrderSelectedIndex == orderIndex"
          @click="atCardClick(orderIndex)"
          style="margin-right: 1px;"
        />
      </Draggable>
    </Container>
    <q-btn
      class="schotten2-card"
      v-if="isAttacker"
      :disable="disableSpecial"
      @click="atRetreatClick"
      color="accent"
      :class="{ 'enable-special': enableRetreat }"
    >
      <div style="font-size: 0.6rem; line-height: 1.1rem;">Retreat</div>
      <q-icon name="directions_run" size="2rem" />
    </q-btn>
    <q-btn
      class="schotten2-card"
      v-if="!isAttacker"
      :disable="disableSpecial || !oilCount"
      @click="atOilClick"
      color="primary"
      :class="{ 'enable-special': enableOil }"
    >
      <div style="font-size: 0.65rem; line-height: 1.1rem;">Oil</div>
      <q-icon name="local_fire_department" size="2rem" />
      <q-badge color="dark" floating>{{ oilCount }}</q-badge>
    </q-btn>
  </div>
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
    const isCurrentPlayer = computed(() => game.state.api.isCurrentPlayer)
    const enablePreparation = computed(() => game.state.api.enablePreparation)
    const isAttacker = computed(() => game.state.api.isAttacker)
    const disableSpecial = computed(
      () => !isCurrentPlayer.value || !enablePreparation.value,
    )
    return {
      hideImages,
      suits,
      newCards: computed(() => game.state.api.newCards),
      handOrder: computed(() => game.state.handOrder),
      handCards: computed(() => game.state.api.handCards || []),
      isAttacker,
      enablePreparation,
      disableSpecial,
      handOrderSelectedIndex: computed(() => game.state.handOrderSelectedIndex),
      atDragCard: game.actions.dragCard,
      atCardClick: game.actions.toggleCard,
      getChildPayload: (orderIndex: number) => {
        if (game.state.api.handCards[orderIndex].disabled) return undefined
        return orderIndex
      },
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
      oilCount: computed(() => game.state.api.oilCount),
      enableOil: computed(() => !disableSpecial.value && game.state.enableOil),
      enableRetreat: computed(
        () => !disableSpecial.value && game.state.enableRetreat,
      ),
      atRetreatClick: () => {
        game.actions.toggleRetreat()
      },
      atOilClick: game.actions.toggleOil,
    }
  },
})
</script>
