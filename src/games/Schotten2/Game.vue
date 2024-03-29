<template>
  <q-page class="flex flex-center full-height" :class="pageClass">
    <section
      class="absolute-top page-container row no-wrap q-px-sm justify-between items-start text-dark"
      style="font-size: 0.7rem; line-height: 1"
    >
      <Log :matchId="matchId" :attacker="attacker" :defender="defender" />
      <div
        class="column bg-white shadow-2 q-pa-xs items-center"
        style="z-index: 3"
      >
        <div class="row q-pb-sm border-bottom text-center text-underline">
          {{ matchName }}
        </div>
        <div class="row no-wrap">
          <div>{{ attacker }}</div>
          <q-icon name="clear" color="primary" size="0.8rem" />
          <div>{{ defender }}</div>
        </div>
      </div>
    </section>
    <Info :opponent="opponent" />

    <table class="schotten2-wall">
      <!-- Opponent Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          class="section-top"
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
          <Section
            :name="section.name"
            :spaces="section.spaces"
            :types="section.types"
            :is-damaged="section.isDamaged"
            :is-active="sectionIndex == lastSection"
            :is-attacker="isAttacker"
          />
        </td>
      </tr>
      <!-- Player Cards -->
      <tr>
        <td
          v-for="(section, sectionIndex) in sections"
          :key="sectionIndex"
          class="section-bottom"
          valign="top"
        >
          <SectionBottom :section="section" :sectionIndex="sectionIndex" />
        </td>
      </tr>
    </table>

    <section class="absolute-bottom page-container q-pb-sm">
      <!-- Player's Hand -->
      <Hand class="schotten2-hand" />
      <!-- Action Buttons -->
      <!-- <Buttons class="q-mt-md" /> -->
    </section>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  onUnmounted,
} from '@vue/composition-api'
import { game } from './game'
import Info from './Info.vue'
import Log from './Log.vue'
import SectionTop from './SectionTop.vue'
import Section from './Section.vue'
import SectionBottom from './SectionBottom.vue'
import Hand from './Hand.vue'

export default defineComponent({
  name: 'Schotten2Game',
  components: {
    Info,
    Log,
    SectionTop,
    Section,
    SectionBottom,
    Hand,
  },
  props: {
    matchId: {
      type: String,
      required: true,
    },
    matchName: {
      type: String,
      required: true,
    },
    attacker: {
      type: String,
      required: true,
    },
    defender: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const htmlElement = document.documentElement
    onMounted(async () => {
      window.scrollTo(0, 1)
      htmlElement.className = 'schotten2-game'
      await game.actions.loadState(props.matchId)
    })
    onUnmounted(async () => {
      htmlElement.className = ''
      await game.actions.disconnect()
    })

    const isAttacker = computed(() => game.state.api.isAttacker)
    return {
      isAttacker,
      opponent: computed(() => {
        const name = game.state.api.isAttacker ? props.defender : props.attacker
        return name || 'Opponent'
      }),
      pageClass: computed(() =>
        isAttacker.value ? 'schotten2-attacker' : 'schotten2-defender',
      ),
      sections: computed(() => game.state.api.sections),
      lastSection: computed(() => game.state.api.lastSection),
    }
  },
})
</script>

<style lang="sass">
html.schotten2-game,
html.schotten2-game body,
  overflow: hidden
  font-size: 14px
  @media(min-width: 375px) and (min-height: 667px)
    font-size: 16px
  @media(min-width: 490px) and (min-height: 700px)
    font-size: 18px
  @media(min-width: 566px) and (min-height: 800px)
    font-size: 20px
  @media(min-width: 622px) and (min-height: 800px)
    font-size: 22px
  @media(min-width: 706px) and (min-height: 800px)
    font-size: 24px
  @media(min-width: 776px) and (min-height: 800px)
    font-size: 26px
  @media(min-width: 800px) and (min-height: 800px)
    font-size: 28px

.match-layout
  // font-size: 0.85rem

.schotten2-game .q-page
  background-color: #eff5dd
  background-size: cover
  background-position: center
  background-repeat: no-repeat
  height: calc(100vh - 5rem)

.schotten2-game .schotten2-attacker
  background-image: url("/st2/info/attack/background.png")

.schotten2-game .schotten2-defender
  background-image: url("/st2/info/defense/background.png")

table
  table-layout: fixed
  border-collapse: collapse
  border-spacing: 0

.schotten2-discards
  width: 100%;

.schotten2-wall td
  padding: 0px
  text-align: center

.schotten2-discards td
  padding: 5px
  font-size: 1.1rem
  line-height: 1.1rem

.schotten2-wall tr:first-child td,
.schotten2-wall tr:last-child td
  height: 11rem

.schotten2-attacker .section-top .schotten2-card,
.schotten2-defender .section-bottom .schotten2-card,
.schotten2-defender .schotten2-hand .schotten2-card
  background: white

.schotten2-section,
.schotten2-card,
.drop-zone
  max-width: 13.6vw
  width: 4rem
  max-height: 17.2vw
  height: 5rem

.schotten2-section
  display: inline-block
  max-width: 14.2vw
  width: 4.3rem
  max-height: 18.6vw
  height: 6.4rem

.schotten2-card
  display: inline-block
  border: none

.schotten2-attacker .drop-zone
  background: $dark-page
.schotten2-defender .drop-zone
  background: white

.drop-zone
  display: none
  opacity: 0.8
.drop-zone-active
  -webkit-filter: drop-shadow(0 0 0.2rem $accent)
  -moz-filter: drop-shadow(0 0 0.2rem $accent)
  -ms-filter: drop-shadow(0 0 0.2rem $accent)
  -o-filter: drop-shadow(0 0 0.2rem $accent)
  .drop-zone
    display: inline-block

.active-section
  -webkit-filter: drop-shadow(0 -0.5rem 0.3rem #eb6f0a)
  -moz-filter: drop-shadow(0 -0.5rem 0.3rem #eb6f0a)
  -ms-filter: drop-shadow(0 -0.5rem 0.3rem #eb6f0a)
  -o-filter: drop-shadow(0 -0.5rem 0.3rem #eb6f0a)

.new-card
  -webkit-filter: drop-shadow(0 0 0.2rem $positive)
  -moz-filter: drop-shadow(0 0 0.2rem $positive)
  -ms-filter: drop-shadow(0 0 0.2rem $positive)
  -o-filter: drop-shadow(0 0 0.2rem $positive)

.enable-special,
.enable-retreat,
.enable-oil .schotten2-card:last-child
  transition: transform 0.18s ease;
  transform: rotateZ(5deg)
  -webkit-filter: drop-shadow(0 0 0.2rem $negative)
  -moz-filter: drop-shadow(0 0 0.2rem $negative)
  -ms-filter: drop-shadow(0 0 0.2rem $negative)
  -o-filter: drop-shadow(0 0 0.2rem $negative)

.card-ghost
  transition: transform 0.18s ease;
  transform: rotateZ(5deg)
  -webkit-filter: drop-shadow(0 0 0.2rem $primary)
  -moz-filter: drop-shadow(0 0 0.2rem $primary)
  -ms-filter: drop-shadow(0 0 0.2rem $primary)
  -o-filter: drop-shadow(0 0 0.2rem $primary)
.card-ghost-drop
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg)
</style>
