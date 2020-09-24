<template>
  <q-page class="text-center page-container column full-height justify-between">
    <!-- Information -->
    <section>
      <div class="row justify-between q-pa-sm">
        <div class="text-right">
          Schotten Totten 2 by
          <a
            href="https://www.knizia.de/"
            class="text-secondary"
            target="_blank"
            >Reiner Knizia</a
          >
        </div>
        <div class="text-left">{{ player }} turn</div>
      </div>
      <Info />
    </section>

    <table class="schotten-wall">
      <!-- Opponent Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="bottom"
        >
          <SectionTop :section="section" :sectionIndex="sectionIndex" />
        </td>
      </tr>
      <!-- Wall -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="center"
        >
          <Section :section="section" :sectionIndex="sectionIndex" />
        </td>
      </tr>
      <!-- Player Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          valign="top"
        >
          <SectionBottom :section="section" :sectionIndex="sectionIndex" />
        </td>
      </tr>
    </table>

    <section>
      <!-- Player's Hand -->
      <Hand />
      <!-- Action Buttons -->
      <Buttons style="margin-top: -5px;" />
    </section>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  computed,
} from '@vue/composition-api'
import { suits } from './design'
import { game } from './game'
import { OpponentInterface } from 'src/store/modules/matchmaker'

export default defineComponent({
  name: 'Schotten2Game',
  components: {
    Info: () => import('./Info.vue'),
    SectionTop: () => import('./SectionTop.vue'),
    Section: () => import('./Section.vue'),
    SectionBottom: () => import('./SectionBottom.vue'),
    Hand: () => import('./Hand.vue'),
    Buttons: () => import('./Buttons.vue'),
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

    const isCurrentPlayer = computed(() => game.state.api.isCurrentPlayer)
    const opponentName = computed(() => {
      const name = game.state.api.isAttacker
        ? props.players[1]?.username
        : props.players[0]?.username
      return name || 'Opponent'
    })
    return {
      player: computed(() =>
        isCurrentPlayer.value ? 'Your' : `${opponentName.value}'s`,
      ),
      suits,
      sections: computed(() => game.state.api.sections),
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
  max-width: 110px
  width: 13.5vw
  max-height: 154px
  height: 18.9vw

.drop-zone
  display: none
  background: $dark-page
  max-width: 110px
  width: 13.5vw
  max-height: 154px
  height: 18.9vw
.drop-zone-active
  -webkit-filter: drop-shadow(0 0 0.3rem $accent)
  -moz-filter: drop-shadow(0 0 0.3rem $accent)
  -ms-filter: drop-shadow(0 0 0.3rem $accent)
  -o-filter: drop-shadow(0 0 0.3rem $accent)
  .drop-zone
    display: inline-block

.active-section
  -webkit-filter: drop-shadow(0 0 0.3rem $primary)
  -moz-filter: drop-shadow(0 0 0.3rem $primary)
  -ms-filter: drop-shadow(0 0 0.3rem $primary)
  -o-filter: drop-shadow(0 0 0.3rem $primary)

.new-card
  -webkit-filter: drop-shadow(0 0 0.3rem $positive)
  -moz-filter: drop-shadow(0 0 0.3rem $positive)
  -ms-filter: drop-shadow(0 0 0.3rem $positive)
  -o-filter: drop-shadow(0 0 0.3rem $positive)

.enable-retreat,
.enable-oil .schotten-card:last-child
  -webkit-filter: drop-shadow(0 0 0.3rem $negative)
  -moz-filter: drop-shadow(0 0 0.3rem $negative)
  -ms-filter: drop-shadow(0 0 0.3rem $negative)
  -o-filter: drop-shadow(0 0 0.3rem $negative)

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
