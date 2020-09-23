<template>
  <q-page class="text-center page-container column full-height justify-between">
    <!-- Player Actions -->
    <!-- <div class="fixed-bottom bg-default shadow-up-6 q-pt-sm full-width">
      <div class="page-container">
        <Buttons />
      </div>
    </div> -->

    <!-- Information -->
    <Info :opponent="isAttacker ? defender.username : attacker.username" />

    <table class="schotten-wall">
      <!-- Opponent Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="bottom"
        >
          <div class="flex column items-center" style="margin-bottom: -10%;">
            <Card
              v-for="(card, cardIndex) in section.topCards"
              :key="cardIndex"
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
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="center"
        >
          <Card class="bg-light-blue-10">
            <div>
              {{ section.name }}
            </div>
            <div>
              {{ section.isDamaged }}
            </div>
          </Card>
        </td>
      </tr>
      <!-- Player Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="top"
        >
          <div class="flex column items-center" style="margin-top: -10%;">
            <Card
              v-for="(card, cardIndex) in section.bottomCards"
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
              v-if="dropZones[sectionIndex].acceptCards"
              :class="{
                'drop-zone-active':
                  dropZones[sectionIndex].acceptCards && selectedCard != -1,
              }"
              behaviour="drop-zone"
              :should-accept-drop="() => true"
              @drop="(dropResult) => atWallDrop(sectionIndex, dropResult)"
            >
              <q-card
                class="drop-zone"
                flat
                @click="atDropZoneClick(sectionIndex)"
              />
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
      @drop="atHandDrop"
      @drag-start="dragCard"
      @drag-end="dropCard"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :get-child-payload="getChildPayload"
    >
      <Draggable v-for="(cardIndex, orderIndex) in handOrder" :key="orderIndex">
        <Card
          v-if="handCards[cardIndex]"
          v-bind="handCards[cardIndex]"
          class="bg-default q-mx-xs"
          :selected="selectedCard == orderIndex"
          @click="toggleCard(orderIndex)"
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
    <q-page-sticky position="bottom-right" :offset="[5, 80]">
      <!-- v-if="isCurrentPlayer" -->
      <q-fab
        @click="loadState(matchId)"
        icon="check"
        color="accent"
        padding="0.8rem"
        :class="{ 'rotate-seconds': isCurrentPlayer }"
      />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  PropType,
  computed,
} from '@vue/composition-api'
import { Container, Draggable, DropResult } from 'vue-smooth-dnd'
import { suits } from './design'
import { game } from './game'
import { OpponentInterface } from 'src/store/modules/matchmaker'

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
    players: {
      type: Array as PropType<OpponentInterface[]>,
      default: () => [],
    },
  },
  setup(props) {
    onMounted(async () => {
      await game.actions.loadState(props.matchId)
    })

    return {
      ...toRefs(game.state),
      suits,
      ...game.actions,
      attacker: computed(() => props.players[0]),
      defender: computed(() => props.players[1]),
      dropResult: {
        addedIndex: 0,
        removedIndex: 0,
        payload: null,
        element: Element.prototype,
      },
      atDropZoneClick: (sectionIndex: number) => {
        console.error(sectionIndex)
        if (game.state.selectedCard < 0) return
        game.actions.addCardToWall(
          game.state.handOrder[game.state.selectedCard],
          sectionIndex,
        )
      },
      atHandDrop: (dropResult: DropResult) => {
        game.actions.shuffleHand(dropResult.removedIndex, dropResult.addedIndex)
      },
      getChildPayload: (orderIndex: number) => game.state.handOrder[orderIndex],
      atWallDrop: (sectionIndex: number, dropResult: DropResult) => {
        if (dropResult.addedIndex == null) return
        if (typeof dropResult.payload != 'number') return
        game.actions.addCardToWall(dropResult.payload, sectionIndex)
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

.schotten-wall tr:first-child td,
.schotten-wall tr:last-child td
  height: 8.4rem

.schotten-card
  display: inline-block
  border-color: $dark-page
  width: 3rem
  height: 4.2rem

.drop-zone
  display: none
  background: $dark-page
  width: 3rem
  height: 4.2rem
.drop-zone-active
  -webkit-filter: drop-shadow(0 0 0.3rem $accent)
  -moz-filter: drop-shadow(0 0 0.3rem $accent)
  -ms-filter: drop-shadow(0 0 0.3rem $accent)
  -o-filter: drop-shadow(0 0 0.3rem $accent)
  .drop-zone
    display: inline-block

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
