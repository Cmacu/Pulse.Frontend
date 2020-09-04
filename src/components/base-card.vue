<template>
  <q-card class="pulse-card">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <q-icon size="lg" :name="icon" />
        </q-avatar>
      </q-item-section>

      <q-item-section class="text-subtitle1">
        <q-item-label class="text-primary">{{ title }}</q-item-label>
        <q-item-label caption>{{ subtitle }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <slot name="extra" />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-linear-progress v-if="loading" indeterminate size="xs" />
    <slot />
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

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
    subtitle: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="sass" scoped>
.pulse-card
  width: 100%
</style>
