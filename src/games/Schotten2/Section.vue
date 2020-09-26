<template>
  <section class="schotten2-section">
    <div class="column justify-end full-height">
      <q-img :src="image" width="100%" contain />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'Section',
  props: {
    name: {
      type: String,
      required: true,
    },
    spaces: {
      type: Number,
      required: true,
    },
    isDamaged: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAttacker: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const side = computed(() => (props.isAttacker ? 'attack' : 'defense'))
    const condition = computed(() => (props.isDamaged ? 'damaged' : 'good'))
    return {
      image: computed(
        () =>
          `/st2/sections/${side.value}/${
            condition.value
          }/${props.name.toLowerCase()}.png`,
      ),
    }
  },
})
</script>
