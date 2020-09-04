<template>
  <q-btn v-bind="attributes" v-on="listeners">
    <slot></slot>
    <q-dialog v-if="tooltip" v-model="showTooltip">
      <q-card>
        <q-card-section v-if="label" class="q-pa-sm">
          <div class="text-h6 text-center text-accent">{{ label }}</div>
        </q-card-section>
        <q-separator v-if="label" />
        <q-card-section class="text-center" v-html="tooltip" />
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'BaseButton',
  props: {
    loading: Boolean,
    color: String,
    icon: String,
    label: String,
    tooltip: String,
  },
  setup(props, { attrs, listeners }) {
    const showTooltip = ref(false)
    const btnListeners = {
      click: () => {
        showTooltip.value = true
      },
    }

    return {
      showTooltip,
      attributes: computed(() => Object.assign(props, attrs)),
      listeners: computed(() => Object.assign(btnListeners, listeners)),
    }
  },
})
</script>
