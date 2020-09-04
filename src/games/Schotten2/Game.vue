<template>
  <q-page
    class="text-center page-container column full-height justify-between"
    style="padding-bottom: 3.2rem;"
  >
    <!-- Player Actions -->
    <div class="fixed-bottom bg-default shadow-up-6 q-pt-sm full-width">
      <div class="page-container">
        <Buttons />
      </div>
    </div>
    <Info class="row" />

    <table class="schotten-wall">
      <!-- Opponent Cards -->
      <tr>
        <td v-for="(part, index) in wall" :key="index" valign="bottom">
          <div class="column reverse">
            <Card
              v-for="(card, index) in part.defendFormation"
              :key="index"
              style="margin-top: -75%;"
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
        </td>
      </tr>
      <!-- Wall -->
      <tr>
        <td v-for="(part, index) in wall" :key="index" valign="center">
          <Card class="bg-light-blue-10 flex flex-center">{{ part.type }}</Card>
        </td>
      </tr>
      <!-- Player Cards -->
      <tr>
        <td v-for="(part, index) in wall" :key="index" valign="top">
          <div class="column">
            <Card
              v-for="(card, index) in part.attackFormation"
              :key="index"
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
            <!-- eslint-disable -->
            <Container
              v-if="part.acceptCard"
              :class="part.dropClass"
              behaviour="drop-zone"
              :should-accept-drop="() => true"
              @drop="(dropResult) => onWallDrop(index, dropResult)"
            >
              <q-card class="drop-zone" flat />
            </Container>
          </div>
        </td>
      </tr>
    </table>

    <!-- Player's Hand -->
    <Container
      orientation="horizontal"
      class="bg-transparent q-pa-sm row justify-center"
      style="display: flex;"
      :drag-begin-delay="0"
      @drop="
        (dropResult) =>
          shuffleHand(dropResult.removedIndex, dropResult.addedIndex)
      "
      @drag-start="dragCard"
      @drag-end="dropCard"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :get-child-payload="getChildPayload"
    >
      <Draggable v-for="(card, index) in hand" :key="index">
        <Card
          v-bind="card"
          class="bg-default q-mx-xs"
          :class="card.selectedClass"
          @click="toggleCard(index, card.selectedClass)"
        >
          <div
            class="row q-gutter items-center justify-between"
            :class="`text-${suits[card.suit].color}`"
          >
            <div>{{ card.rank }}</div>
            <q-icon :name="suits[card.suit].icon" />
          </div>
        </Card>
      </Draggable>
    </Container>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted } from '@vue/composition-api'
import { Container, Draggable, DropResult } from 'vue-smooth-dnd'
import { suits } from './design'
import { isNumber } from 'util'
import {
  state,
  stopLoading,
  toggleCard,
  dragCard,
  dropCard,
  shuffleHand,
  addCardToWall,
} from './state'

export default defineComponent({
  name: 'Schotten2Game',
  components: {
    Container,
    Draggable,
    Card: () => import('./Card.vue'),
    Info: () => import('./Info.vue'),
    Buttons: () => import('./ Buttons.vue'),
  },
  props: {
    matchId: {
      type: String,
      required: true,
    },
  },
  setup() {
    onMounted(() => {
      stopLoading()
    })

    return {
      ...toRefs(state),
      suits,
      toggleCard,
      dragCard,
      dropCard,
      shuffleHand,
      getChildPayload: (index: number) => index,
      onWallDrop: (index: number, dropResult: DropResult) => {
        if (dropResult.addedIndex != 0) return
        if (!isNumber(dropResult.payload)) return
        console.error(index, dropResult)
        addCardToWall(dropResult.payload, index)
      },
    }
  },
})
</script>

<style lang="sass">
.schotten-wall
  table-layout: fixed
  border-collapse: collapse
  border-spacing: none

.schotten-card
  border-color: $dark-page
  width: 3rem
  height: 4rem

.drop-zone
  background: $dark-page
  width: 3rem
  height: 4rem
.drop-zone-active
  -webkit-filter: drop-shadow(0 0 0.3rem $accent)
  -moz-filter: drop-shadow(0 0 0.3rem $accent)
  -ms-filter: drop-shadow(0 0 0.3rem $accent)
  -o-filter: drop-shadow(0 0 0.3rem $accent)

.card-ghost
  transition: transform 0.18s ease;
  transform: rotateZ(5deg)
  -webkit-filter: drop-shadow(0 0 0.3rem $primary)
  -moz-filter: drop-shadow(0 0 0.3rem $primary)
  -ms-filter: drop-shadow(0 0 0.3rem $primary)
  -o-filter: drop-shadow(0 0 0.3rem $primary)
.card-ghost-drop
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg)
</style>
