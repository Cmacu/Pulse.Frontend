<template>
  <q-card class="page-container q-pa-md" style="font-size: 0.8rem;">
    <q-card-section title class="row items-center">
      <div class="text-special-13 text-center">SCHOTTEN TOTTEN 2 RULES</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <div class="text-center">
        Designed by
        <a href="https://www.knizia.de/" class="text-secondary" target="_blank"
          >Reiner Knizia</a
        >
      </div>
      <p class="text-bold text-special-11">Goal</p>
      <p>
        You are the leader of a powerful faction, sending troops (Cards) to
        either defend or attack the castle wall.
      </p>

      <p class="text-bold text-special-11">Victory:</p>
      <p>
        The Attacker wins immediately if:
      </p>
      <div class="row">
        <div class="col-8">
          <p>
            - They control 1 damaged Wall Tile
          </p>
          <p>
            - They damage 4 Wall Tiles
          </p>
        </div>
        <div class="col-4">
          image "Controlled damaged tile"
        </div>
      </div>
      <p>
        - Once the last card in the Siege Card deck is drawn, the Attacker gets
        one more turn. The Defender wins if the Attacker has not met a victory
        condition.
      </p>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-bold text-special-11">
        Game Elements:
      </p>
      <div class="row">
        <div class="col-8">
          - 60 Siege Cards:
        </div>
        <div class="col-4">
          image "Siege Card Back"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          - 7 Wall tiles
        </div>
        <div class="col-4">
          image "Wall tile"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          - 3 Oil Cauldrons
        </div>
        <div class="col-4">
          image "Oil icon"
        </div>
      </div>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-bold text-special-11">
        On your Turn:
      </p>
      <p>
        You begin the game with a hand of 6 Siege Cards. Turns consist of three
        phases to be taken in order:
      </p>
      <p class="text-bold text-primary">
        Take a preparation action (optional):
      </p>
      <p>
        - The Attacker may retreat by discarding all cards from their side of
        any number of Wall Tiles
      </p>
      <p>
        - The Defender may throw an Oil Cauldron to remove the Attacker’s Card
        closest to the Wall Tile of your choice. Limit, once per turn, and three
        per game.
      </p>

      <p class="text-bold text-primary">
        Play 1 Card:
      </p>
      <div class="row">
        <div class="col-8">
          You must choose a Card from your hand and place it in front of any
          Wall Tile provided the number of cards does not exceed the number of
          available spaces displayed on the selected Wall Tile.
        </div>
        <div class="col-4">
          image "blank formation limit icon"
        </div>
      </div>

      <p class="text-bold text-primary">
        Draw 1 Card:
      </p>
      <p>
        You must draw 1 Card from the Siege Card deck to restore a hand size of
        7.
      </p>

      <p class="text-bold text-primary">
        Declaring Control
      </p>
      <p>
        At any time, the Attacker can declare control of any Wall Tile(s) where
        the formation is complete meaning there are as many Cards on the
        Attackers side as available spaces displayed on the selected Wall Tile.
      </p>

      <p>
        To declare control, the Attacker must prove that the Defender cannot
        complete a stronger formation on the designated Wall Tile (see
        Evaluating Formations below).
      </p>

      <p>
        If the attacker is successful, the Wall Tile is flipped to reveal it’s
        damaged side. All Cards on both sides of the Wall Tile are then
        discarded and new Cards may be played.
      </p>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-bold text-special-11">
        Evaluating Formations:
      </p>
      <p>
        Listed below are the five types of formations which may be played on
        Wall Tiles in order from strongest to weakest.
      </p>

      <q-list>
        <q-item v-for="(formation, index) in formations" :key="index">
          <q-item-section>
            <strong>{{ formation.name }}</strong>
            <p>{{ formation.description }}</p>
          </q-item-section>
          <q-item-section>
            <div class="row">
              <div
                class="col"
                v-for="(card, index) in formation.example"
                :key="index"
              >
                <SiegeCard v-bind="card" />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <p>
        However, only the formation type that is shown on the Wall Tile may be
        evaluated for declaring control.
      </p>

      <div class="row">
        <div class="col-8">
          Any formation is considered
        </div>
        <div class="col-4">
          image "blank formation limit icons"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          Only highest (+) or lowest (-) Sum formations are considered
        </div>
        <div class="col-4">
          image "+ & - formation limit icons"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          Same Strength and Sum formations are considered
        </div>
        <div class="col-4">
          image "= formation limit icon"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          Color and Sum formations are considered
        </div>
        <div class="col-4">
          image "color formation limit icon"
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          Run and Sum formations are considered
        </div>
        <div class="col-4">
          image "run and sum limit icon"
        </div>
      </div>
      <p>
        Finally, if two formations of the same type are evaluated, the highest
        Sum breaks the tie.
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { formations } from './design'

export default defineComponent({
  name: 'Rules',
  components: {
    SiegeCard: () => import('./SiegeCard.vue'),
  },
  props: {},
  setup() {
    return {
      formations,
    }
  },
})
</script>
