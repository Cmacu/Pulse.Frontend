<template>
  <section class="schotten2-section">
    <div class="column justify-end full-height" @click="showDialog = true">
      <q-img
        :src="image"
        width="100%"
        contain
        :class="{ 'active-section': isActive }"
      />
    </div>

    <q-dialog v-model="showDialog" auto-close>
      <q-card class="page-container q-pa-sm" style="font-size: 0.75rem;">
        <q-card-section title>
          <div class="text-special-13 text-center">{{ name }}</div>
        </q-card-section>
        <q-separator class="q-mb-md" inset />
        <q-card-section class="row items-end">
          <div class="col-8 q-pa-sm">
            <!-- SECTION SPACE DETAILS -->
            <p>
              This wall section accepts exactly
              <strong>{{ spaces }} </strong>cards.
            </p>
            <!-- SECTION FORMATION DETAILS -->
            <p>
              Allowed formation types from strongest to lowest are:
            </p>
          </div>
          <!-- BIGGER SECTION IMAGE -->
          <div class="col-4">
            <q-img :src="image" contain />
          </div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item v-for="type in types" :key="type" class="q-pa-md">
              <q-item-section>
                <strong>{{ formations[type].name }}</strong>
                <p>{{ formations[type].description }}</p>
              </q-item-section>
              <q-item-section>
                <div class="row">
                  <div
                    class="col"
                    v-for="(card, index) in formations[type].example"
                    :key="index"
                  >
                    <SiegeCard v-bind="card" />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from '@vue/composition-api'
import { formations } from './design'

export default defineComponent({
  name: 'Section',
  components: { SiegeCard: () => import('./SiegeCard.vue') },
  props: {
    name: {
      type: String,
      required: true,
    },
    spaces: {
      type: Number,
      required: true,
    },
    types: {
      type: Array as PropType<number[]>,
      default: () => [],
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
    const showDialog = ref(false)
    const side = computed(() => (props.isAttacker ? 'attack' : 'defense'))
    const condition = computed(() => (props.isDamaged ? 'damaged' : 'good'))
    console.error(props.types)
    return {
      formations,
      showDialog,
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
