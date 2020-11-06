<template>
  <q-card class="pulse-card">
    <q-item>
      <q-item-section avatar @click="toggleSlot">
        <q-avatar>
          <q-icon size="27px" :name="mainIcon" />
        </q-avatar>
      </q-item-section>
      <q-item-section
        class="text-subtitle1"
        :class="{ 'text-center': titleCenter }"
        @click="toggleSlot"
      >
        <q-item-label class="text-primary">{{ title }}</q-item-label>
        <q-item-label caption v-html="subtitle" />
      </q-item-section>
      <q-item-section side>
        <slot name="extra" />
      </q-item-section>
    </q-item>
    <q-separator v-if="showSlot && !loading" />
    <q-linear-progress v-if="loading" indeterminate size="1px" />
    <slot v-if="showSlot" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'BaseCard',
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleCenter: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props) => {
    const showSlot = ref(true)
    return {
      showSlot,
      mainIcon: computed(() => (showSlot.value ? props.icon : 'unfold_more')),
      toggleSlot: () => {
        if (!props.collapsible) return
        showSlot.value = !showSlot.value
      },
    }
  },
})
</script>

<style lang="sass" scoped>
.pulse-card
  width: 100%
</style>
