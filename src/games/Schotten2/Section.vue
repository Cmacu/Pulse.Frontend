<template>
  <section class="schotten2-section relative-position">
    <div class="column justify-end full-height" @click="showDialog = true">
      <q-img
        :src="image"
        width="100%"
        contain
        :class="{ 'active-section': isActive }"
      />
      <div
        v-if="isActive && lastEvent"
        class="absolute-bottom text-center"
        style="margin-bottom: 5px;"
      >
        <q-icon :name="lastEvent.icon" :color="lastEvent.color" size="1.3rem" />
      </div>
    </div>

    <q-dialog v-model="showDialog" auto-close>
      <q-card class="page-container q-pa-sm" style="font-size: 0.75rem;">
        <q-card-section title class="row items-center">
          <div class="text-special-13 text-center">
            <span>{{ name }}</span>
            <strong v-if="isDamaged">(Damaged)</strong>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
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
            <q-item v-for="type in types" :key="type" class="row q-pa-none">
              <q-item-section>
                <strong>{{ formations[type].name }}</strong>
                <p>{{ formations[type].description }}</p>
              </q-item-section>
              <q-item-section>
                <div class="row justify-end">
                  <div
                    class="col"
                    v-for="(card, index) in getFormationCards(type)"
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
import { formations, events } from './design'
import { game } from './game'

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
    return {
      showName: computed(() =>
        props.name.replace('Left', '').replace('Right ', ''),
      ),
      lastEvent: computed(() => {
        const lastEvent = game.state.api.lastEvent
        if (Object.prototype.hasOwnProperty.call(events, lastEvent)) {
          return events[lastEvent]
        }
      }),
      formations,
      showDialog,
      image: computed(
        () =>
          `/st2/sections/${side.value}/${
            condition.value
          }/${props.name.toLowerCase()}.png`,
      ),
      getFormationCards: (type: number) =>
        formations[type].example.slice(0, props.spaces),
    }
  },
})
</script>
