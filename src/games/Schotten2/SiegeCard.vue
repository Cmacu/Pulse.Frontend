<template>
  <q-card
    class="schotten2-card"
    :class="{ 'card-ghost': selected }"
    v-bind="attributes"
    v-on="listeners"
    bordered
  >
    <div class="column full-height">
      <div class="row justify-around q-mt-xs">
        <div
          :style="{
            color,
            'line-height': '1.1rem',
            'font-size': '1rem',
            'width': '1rem',
            'height': '1rem',
          }"
        >
          {{ rank }}
        </div>
        <div style="width: 1rem; height: 1rem;">
          <q-img v-if="!hideImage" :src="symbol" contain />
        </div>
      </div>
      <div style="flex: 1;">
        <div class="flex full-height flex-center">
          <q-img
            v-if="!hideImage"
            :src="symbol"
            width="60%"
            height="auto"
            basic
            contain
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { suits } from './design'

export default defineComponent({
  name: 'SiegeCard',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    hideImage: {
      type: Boolean,
      default: false,
    },
    suit: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
  },
  setup(props, { attrs, listeners }) {
    return {
      color: computed(() => suits[props.suit]?.color),
      symbol: computed(() => `/st2/symbols/${props.suit}.png`),
      attributes: computed(() => Object.assign(props, attrs)),
      listeners: computed(() => Object.assign({}, listeners)),
    }
  },
})
</script>
