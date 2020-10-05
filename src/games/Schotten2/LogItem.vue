<template>
  <div class="row q-gutter-xs justify-end items-center">
    <q-icon v-if="isCurrent" name="check" color="positive" size="1rem" />
    <span>{{ player }}</span>
    <i>{{ description }}</i>
    <strong>{{ section }}</strong>
    <span v-if="cards.length">[</span>
    <template v-for="card in cards">
      <span
        v-if="card && card.protected"
        :key="'vs_' + card.rank + '_' + card.suit"
        >vs</span
      >
      <span
        v-if="card && !card.protected"
        :key="'rank_' + card.rank + '_' + card.suit"
        :style="{ color: suits[card.suit].color }"
        >{{ card.rank }}</span
      >
      <img
        v-if="card && !card.protected"
        :key="'suit_' + card.rank + '_' + card.suit"
        :src="`/st2/symbols/${card.suit}.png`"
        style="height: 0.6rem; width: auto;"
      />
    </template>
    <span v-if="cards.length">]</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { Schotten2Card } from './game'
import { suits } from './design'

export default defineComponent({
  name: 'LogItem',
  props: {
    player: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    cards: {
      type: Array as PropType<Schotten2Card[]>,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  setup: () => {
    return {
      suits,
    }
  },
})
</script>
