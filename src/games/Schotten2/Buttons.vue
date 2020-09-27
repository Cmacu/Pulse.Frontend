<template>
  <!-- Buttons -->
  <q-btn-group spread>
    <q-btn :disable="disableUndo" :color="color" label="Undo" dense />
    <q-btn
      v-if="isAttacker"
      :disable="disableSpecial"
      label="Retreat"
      :class="{ 'active-special': enableRetreat }"
      :color="color"
      @click="atRetreatClick"
      dense
    />
    <q-btn
      v-if="!isAttacker"
      :disable="disableSpecial"
      label="Use Oil"
      :class="{ 'active-special': enableOil }"
      :color="color"
      @click="atOilClick"
      dense
    />
    <q-btn-dropdown
      :disable-main-btn="disableDone"
      auto-close
      :color="color"
      label="Done"
      dropdown-icon="more_vert"
      split
    >
      <q-list>
        <q-item clickable disable v-close-popup class="q-pa-md">
          <q-item-section>
            <q-item-label class="text-negative">Retreat</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="directions_run" color="negative" />
          </q-item-section>
        </q-item>

        <q-item clickable disable v-close-popup class="q-pa-md">
          <q-item-section>
            <q-item-label class="text-warning">Report</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="warning" color="warning" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-btn-group>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { game } from './game'

export default defineComponent({
  name: 'Buttons',
  setup() {
    const isCurrentPlayer = computed(() => game.state.api.isCurrentPlayer)
    const enablePreparation = computed(() => game.state.api.enablePreparation)
    const cardPlayed = computed(() => game.state.cardPlayed)
    const isAttacker = computed(() => game.state.api.isAttacker)
    const disableSpecial = computed(
      () => !isCurrentPlayer.value || !enablePreparation.value,
    )
    return {
      color: computed(() => (isAttacker.value ? 'accent' : 'primary')),
      isAttacker,
      isCurrentPlayer,
      enablePreparation,
      cardPlayed,
      disableUndo: computed(() => {
        if (!isCurrentPlayer.value) return true
        if (!enablePreparation.value) return false
        if (cardPlayed.value) return false
        return true
      }),
      disableSpecial,
      enableOil: computed(() => !disableSpecial.value && game.state.enableOil),
      enableRetreat: computed(
        () => !disableSpecial.value && game.state.enableRetreat,
      ),
      disableDone: computed(() => !isCurrentPlayer.value || !cardPlayed.value),
      atRetreatClick: game.actions.toggleRetreat,
      atOilClick: game.actions.toggleOil,
    }
  },
})
</script>

<style lang="sass">
.active-special
  border-top: 5px solid $negative
  .block
    font-size: 1.2rem
</style>
