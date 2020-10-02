<template>
  <q-page class="flex flex-center full-height" :class="pageClass">
    <Info :attacker="attacker" :defender="defender" />

    <table class="schotten2-wall page-container">
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

export default defineComponent({
  name: 'Schotten2Game',
  components: {
    Info: () => import('./Info.vue'),
    SectionTop: () => import('./SectionTop.vue'),
    Section: () => import('./Section.vue'),
    SectionBottom: () => import('./SectionBottom.vue'),
    Hand: () => import('./Hand.vue'),
  },
  props: {
    matchId: {
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
  font-size: 16px
  @media(min-width: 400px)
    font-size: 19px
  @media(min-width: 500px)
    font-size: 22px
  @media(min-width: 600px)
    font-size: 25px
  @media(min-width: 700px)
    font-size: 28px
  @media(min-width: 800px)
    font-size: 31px

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

.schotten2-wall,
.schotten2-discards
  width: 100%;
  table-layout: fixed
  border-collapse: collapse
  border-spacing: 0

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
.schotten2-card
  display: inline-block
  border: none
  max-width: 110px
  width: 13.8vw
  max-height: 145px
  height: 18.22vw

.schotten2-attacker .drop-zone
  background: $dark-page
.schotten2-defender .drop-zone
  background: white

.drop-zone
  display: none
  opacity: 0.8
  max-width: 110px
  width: 13.8vw
  max-height: 145px
  height: 18.22vw
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
