<template>
  <q-tabs v-bind="attributes" v-on="listeners" style="width: 100%;">
    <q-route-tab
      v-for="tab in tabs"
      v-bind="tab"
      :key="tab.to"
      :name="tab.to"
      exact
    />
  </q-tabs>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import { TabItem } from 'src/store/modules/config'

export default defineComponent({
  name: 'MenuTabs',
  props: {
    tabs: {
      type: Array as PropType<TabItem[]>,
      default: () => [],
    },
  },
  setup(props, { attrs, listeners }) {
    return {
      attributes: computed(() => Object.assign(props, attrs)),
      listeners,
    }
  },
})
</script>
