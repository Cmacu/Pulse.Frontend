<template>
  <q-card
    class="schotten2-card bg-transparent"
    :class="{ 'card-ghost': selected }"
    v-bind="attributes"
    v-on="listeners"
  >
    <q-img :src="image" contain />
    <q-badge
      v-if="counter >= 0"
      floating
      :color="color"
      style="font-size: 0.6rem; margin-top: -0.4rem; padding: 0.2rem;"
      >{{ counter }}</q-badge
    >
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { game } from './game'

export default defineComponent({
  name: 'InfoCard',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    counter: {
      type: Number,
      default: -1,
    },
  },
  setup(props, { attrs, listeners }) {
    return {
      color: computed(() => (game.state.api.isAttacker ? 'accent' : 'primary')),
      image: computed(() => `/st2/info/attack/${props.name}.png`),
      attributes: computed(() => Object.assign(props, attrs)),
      listeners: computed(() => Object.assign({}, listeners)),
    }
  },
})
</script>
