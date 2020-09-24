<template>
  <Card
    class="bg-light-blue-10"
    :class="{ 'active-section': sectionIndex == activeSectionIndex }"
  >
    <div>
      {{ section.name }}
    </div>
    <div>
      {{ section.isDamaged }}
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { game, Schotten2Section } from './game'

export default defineComponent({
  name: 'Section',
  props: {
    section: {
      type: Object as PropType<Schotten2Section>,
      required: true,
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
  },
  components: {
    Card: () => import('./Card.vue'),
  },
  setup() {
    return {
      activeSectionIndex: computed(() => game.state.api.activeSectionIndex),
    }
  },
})
</script>
