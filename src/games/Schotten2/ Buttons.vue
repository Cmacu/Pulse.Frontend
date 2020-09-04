<template>
  <section class="row q-pb-sm q-gutter-sm justify-center">
    <q-btn round icon="undo" color="negative" size="0.8rem" />
    <q-btn round icon="eject" color="warning" size="0.8rem" />
    <q-btn round icon="check" color="primary" size="0.8rem" />
    <q-btn round icon="sports" color="positive" size="0.8rem" />
    <q-btn round icon="more_horiz" color="secondary text-black" size="0.8rem" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Buttons',
})
</script>
