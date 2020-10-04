<template>
  <div
    v-if="description"
    class="absolute-bottom row justify-center q-gutter-xs q-px-sm text-center items-center"
    style="bottom: -1rem; font-size: 0.6rem;"
  >
    <span>{{ player }}</span>
    <i>{{ description }}</i>
    <strong>{{ section }}</strong>
    <span v-if="cards.length">(</span>
    <template v-for="(card, index) in cards">
      <span v-if="card.protected" :key="index">vs</span>
      <span
        v-if="!card.protected"
        :key="index"
        :style="{ color: suits[card.suit].color }"
        >{{ card.rank }}</span
      >
      <img
        v-if="!card.protected"
        :key="index"
        :src="`/st2/symbols/${card.suit}.png`"
        style="height: 0.6rem; width: auto;"
      />
    </template>
    <span v-if="cards.length"> )</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { game } from './game'
import { suits, events } from './design'

export default defineComponent({
  name: '',
  props: {
    attacker: {
      type: String,
      required: true,
    },
    defender: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const lastLog = computed(() => game.state.log[game.state.log.length - 1])
    const event = computed(() =>
      lastLog.value ? events[lastLog.value.event] : undefined,
    )
    return {
      suits,
      player: computed(() =>
        lastLog.value?.role == '0' ? props.attacker : props.defender,
      ),
      cards: computed(() => {
        if (event.value?.skipCards) return []
        if (!lastLog.value?.cards) return []
        return lastLog.value.cards
      }),
      section: computed(() => {
        if (!lastLog.value?.section) return ''
        return lastLog.value.section
          .replace('Left', 'West ')
          .replace('Right', 'East ')
      }),
      description: computed(() => event.value?.description || ''),
      icon: computed(() => event.value?.icon || ''),
      color: computed(() => event.value?.color || ''),
    }
  },
})
</script>
