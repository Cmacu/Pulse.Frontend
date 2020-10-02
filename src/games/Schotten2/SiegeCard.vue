<template>
  <q-card
    class="schotten2-card"
    :class="{ 'card-ghost': selected }"
    style="padding: 0.2rem;"
    v-bind="attributes"
    v-on="listeners"
    bordered
  >
    <div class="column full-height">
      <div class="row no-wrap justify-between items-center">
        <div
          class="col-auto text-left"
          :style="{
            color,
            'line-height': '1rem',
            'font-size': '1.1rem',
            'width': '1rem',
            'height': '1rem',
          }"
        >
          {{ rank }}
        </div>
        <q-img
          v-if="!hideImage"
          class="col-auto"
          :src="symbol"
          style="width: 1rem; height: 1rem;"
          contain
        />
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
