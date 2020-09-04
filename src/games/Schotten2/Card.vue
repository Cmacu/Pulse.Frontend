<template>
  <q-card
    class="schotten-card q-px-xs ellipsis"
    v-bind="attributes"
    v-on="listeners"
    bordered
  >
    <slot></slot>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'Card',
  setup(props, { attrs, listeners }) {
    const selectedClass = ref('')
    return {
      attributes: computed(() => Object.assign({}, props, attrs)),
      listeners: computed(() => Object.assign({}, listeners)),
      selectedClass,
    }
  },
})
</script>
