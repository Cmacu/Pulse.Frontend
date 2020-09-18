<template>
  <div v-bind="attributes">
    <strong style="font-size: 0.8rem; line-height: 0.8rem;">
      {{ match }}
    </strong>
    <q-badge
      v-if="delta.rating"
      outline
      :color="delta.color"
      :label="`${delta.sign} ${Math.abs(delta.rating)}`"
      style="font-size: 0.8rem; line-height: 0.8rem;"
    />
    <q-badge
      v-if="delta.decay"
      outline
      color="secondary"
      :label="delta.decay"
      style="font-size: 0.8rem; line-height: 0.8rem;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api'
import { DeltaInterface } from 'src/store/modules/player'

export default defineComponent({
  name: 'MatchDelta',
  props: {
    match: {
      type: String,
      required: true,
    },
    delta: {
      type: Object as PropType<DeltaInterface>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return {
      attributes: computed(() => Object.assign({}, attrs)),
      matchClass: computed(() =>
        props?.delta.side == 'left' ? 'order-last' : 'order-first',
      ),
    }
  },
})
</script>
