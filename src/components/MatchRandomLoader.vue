<template>
  <q-carousel
    animated
    v-model="slide"
    infinite
    autoplay
    style="margin-top: -16px; background: transparent;"
  >
    <q-carousel-slide
      v-for="(message, index) in loadingMessages"
      :key="message"
      :name="index"
    >
      <q-spinner-dots /> &nbsp; {{ message }} &nbsp;
      <q-spinner-dots />
    </q-carousel-slide>
  </q-carousel>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onUpdated,
} from '@vue/composition-api'
import { shuffleArray, messages } from 'src/utils/loadr'

export default defineComponent({
  name: 'RandomLoader',
  setup() {
    const state = reactive({
      slide: 1,
      loadingMessages: messages,
    })
    onUpdated(() => {
      shuffleArray(state.loadingMessages)
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>
