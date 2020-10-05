<template>
  <q-card class="page-container q-pa-md" style="font-size: 0.7rem;">
    <q-card-section title class="row items-center q-pb-md">
      <div class="text-special-13 text-center">GAME RULES</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <div class="text-center">
        Schotten Totten 2 Designed <br />
        by
        <a href="https://www.knizia.de/" class="text-secondary" target="_blank"
          >Reiner Knizia</a
        >
      </div>
      <br />
      <p>
        Aífe stood before Dún Scáith, the mythical Fortress of Shadow. She knew
        to choose the approach carefully, feigning charges to make the Chulainn
        over commit and give an opening elsewhere. However, play too many tricks
        and she would surely fail as the siege could only be kept up for so
        long...
      </p>
      <p>
        Chulainn stood on his highest rampart squinting to see where the Aífe
        would first attempt to breach the walls. This was the last stand as
        there would be no retreat. He saw his men taking cramped defensive
        positions on the walls and hoped they wouldn’t soon see those walls
        crumble in upon them.
      </p>
      <p>
        The highland mist began to clear… both sides knew the battle would soon
        be decided.
      </p>
      <p class="text-bold text-special-11">Goal</p>
      <p>
        You are the leader of a powerful faction, sending troops
        (<strong>Cards</strong>) to either defend or attack the castle wall
      </p>

      <p class="text-bold text-special-11">Victory:</p>
      <p>
        The Attacker wins immediately if:
      </p>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          <p>- They control 1 <i>damaged</i> <strong>Wall Section</strong></p>
          <p>- They <i>damage</i> 4 <strong>Wall Sections</strong></p>
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/damaged/door.png`" contain />
        </div>
      </div>
      <p>
        Alternatively, when the Attacker is unable to draw a card, they have one
        additional turn to complete one of their win conditions.
        <i
          >The Defender wins if the Attacker has not met a victory condition.</i
        >
      </p>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-bold text-special-11">
        Game Elements:
      </p>
      <div class="row items-center q-pb-md">
        <div class="col-10">- 60 <strong>Siege Cards</strong>:</div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/info/${side}/siege.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">- 7 <strong>Wall Sections</strong></div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/good/door.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">- 3 <strong>Oil Cauldrons</strong></div>
        <div class="col-2 text-center">
          <q-icon name="local_fire_department" size="xl" />
        </div>
      </div>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-bold text-special-11">
        On your Turn:
      </p>
      <p>
        You begin the game with a hand of 6 <strong>Siege Cards</strong>. Turns
        consist of three phases to be taken in order:
      </p>
      <p class="text-bold text-primary">
        Take a preparation action (optional):
      </p>
      <p>
        - The Attacker may <i>retreat</i> by discarding all cards from their
        side of any number of <strong>Wall Sections</strong>
      </p>
      <p>
        - The Defender may throw an <strong>Oil Cauldron</strong> to remove the
        Attacker’s <strong>Card</strong>
        closest to the Wall Section of your choice. Limit, once per turn, and
        three per game.
      </p>

      <p class="text-bold text-primary">Play 1 <strong>Card</strong>:</p>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          You must choose a <strong>Card</strong> from your hand and place it in
          front of any <strong>Wall Section</strong> provided the number of
          cards does not exceed the number of available spaces displayed on the
          selected <strong>Wall Section</strong>. Note: If a 0
          <strong>Card</strong> is played opposite an 11
          <strong>Card</strong> of the same color then both cards are removed.
          The same is true if the 0 <strong>Card</strong> was played before the
          11 <strong>Card</strong>.
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/info/${side}/play.png`" contain />
        </div>
      </div>

      <p class="text-bold text-primary">Draw 1 <strong>Card</strong>:</p>
      <p>
        You must draw 1 <strong>Card</strong> from the
        <strong>Siege Card</strong> deck to restore a hand size of 6.
      </p>

      <p class="text-center text-primary">
        Declaring Control
      </p>
      <p>
        Any time a card is played, the control is evaluated automatically for
        any <strong>Wall Section(s)</strong> where the formation is complete
        meaning there are as many <strong>Cards</strong> on the Attackers side
        as available spaces displayed on the selected
        <strong>Wall Section</strong>.
      </p>

      <p>
        Control is awarded if, for the rest of the game, it would not be
        possible for the Defender to complete a stronger formation on the
        designated <strong>Wall Section</strong> by playing a card (see
        Evaluating Formations below). Note: the use of oil is not considered in
        this evaluation. The potential for the 0 and 11 strength
        <strong>Cards</strong> are also not considered.
      </p>

      <p>
        If the attacker is successful, the <strong>Wall Section</strong> is
        flipped to reveal it’s damaged side. All <strong>Cards</strong> on both
        sides of the <strong>Wall Section</strong> are then discarded and new
        <strong>Cards</strong> may be played. Reminder: the game ends in an
        Attacker victory at this time if the damaged
        <strong>Wall Section</strong> was previously damaged or if it is the
        fourth <strong>Wall Section</strong> to have been damaged.
      </p>
    </q-card-section>
    <q-separator class="q-mb-md" inset />
    <q-card-section>
      <p class="text-center text-special-11">
        Evaluating Formations:
      </p>
      <p>
        Listed below are the five types of formations which may be played on
        <strong>Wall Section</strong> in order from strongest to weakest.
      </p>

      <q-list>
        <q-item v-for="(formation, index) in formations" :key="index">
          <q-item-section>
            <strong>{{ formation.name }}</strong>
            <p>{{ formation.description }}</p>
          </q-item-section>
          <q-item-section>
            <div class="row items-center q-pb-md">
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
        However, only the formation type that is shown on the
        <strong>Wall Section</strong> may be evaluated for declaring control.
      </p>

      <div class="row items-center q-pb-md">
        <div class="col-10">
          Any formation is considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/good/tower.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          Only highest (+) Sum formations are considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/good/leftpit.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          Only lowest (-) Sum formations are considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/good/rightpit.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          Same Strength and Sum formations are considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/damaged/tower.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          Color and Sum formations are considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/damaged/wall.png`" contain />
        </div>
      </div>
      <div class="row items-center q-pb-md">
        <div class="col-10">
          Run and Sum formations are considered
        </div>
        <div class="col-2 text-center">
          <q-img :src="`/st2/sections/${side}/damaged/leftpit.png`" contain />
        </div>
      </div>
      <p>
        Finally, if two formations of the same type are evaluated, the highest
        Sum breaks the tie. If there is still a tie, then the first to have
        completed their formation is awarded control.
      </p>
      <br />
      <br />
      <br />
      <p>
        Schotten Totten 2 Rules Version 0.0.1 @
        <a href="https://pulsegames.io">pulsegames.io</a>
      </p>
      <p>
        © Dr. Reiner Knizia, 2020. All rights reserved.
        <a href="http://www.knizia.de">www.knizia.de</a>
      </p>
      <br />
      <br />
      <br />
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
  props: {
    side: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      formations: formations.filter((x) => x.name != 'Low Sum').reverse(),
    }
  },
})
</script>
