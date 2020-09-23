<template>
  <q-card
    class="schotten-card ellipsis"
    :class="{ 'card-ghost': selected }"
    v-bind="attributes"
    v-on="listeners"
    bordered
  >
    <slot></slot>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'Card',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, listeners }) {
    return {
      attributes: computed(() => Object.assign(props, attrs)),
      listeners: computed(() => Object.assign({}, listeners)),
    }
  },
})
</script>
