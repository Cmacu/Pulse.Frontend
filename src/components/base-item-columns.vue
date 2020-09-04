<template>
  <q-item-section>
    <div class="row q-my-sm">
      <div class="col-12 col-sm-4 text-center q-px-md">
        <slot name="default"></slot>
      </div>
      <div
        class="col-6 col-sm-4 text-left"
        :class="{ 'order-first': !leftFirst }"
      >
        <slot name="left"></slot>
      </div>
      <div class="col-6 col-sm-4 text-right">
        <slot name="right"></slot>
      </div>
    </div>
  </q-item-section>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { Screen } from 'quasar'

export default defineComponent({
  name: 'BaseItemColumns',
  setup() {
    return {
      leftFirst: computed(() => Screen.lt.sm),
    }
  },
})
</script>
