<template>
  <base-card
    icon="toggle_on"
    :title="title"
    subtitle="Game Options"
    :loading="loading"
  >
    <template slot="extra">
      <div class="row items-center q-gutter-sm">
        <base-btn v-bind="matchmakerHelp" round flat />
      </div>
    </template>
    <q-card-section>
      <div class="row justify-around items-center">
        <div>
          <q-select
            label="Title"
            v-model="gameTitle"
            :options="titleOptions"
            behavior="dialog"
            color="accent"
            borderless
            style="width: 200px"
          />
        </div>
        <div>
          <q-select
            label="Mode"
            v-model="gameMode"
            :options="modeOptions"
            color="accent"
            borderless
            style="width: 200px"
          />
          <q-select
            label="Speed"
            v-model="gameSpeed"
            :options="speedOptions"
            color="accent"
            borderless
            style="width: 200px"
          />
        </div>
      </div>
    </q-card-section>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import store from 'src/store'

export default defineComponent({
  name: 'GameOptions',
  setup: () => {
    const loading = ref(false)
    const titleOptions = ref<string[]>([
      // '<img src="/symbols/SchottenTotten2.png" height="200" />',
    ])
    const modeOptions = ref<string[]>(['Competitive', 'Casual', 'Demo'])
    const speedOptions = ref<string[]>(['Blitz', 'Async', 'Unlimited'])

    return {
      loading,
      titleOptions,
      gameTitle: ref(titleOptions.value[0]),
      modeOptions,
      gameMode: ref(modeOptions.value[0]),
      speedOptions,
      gameSpeed: ref(speedOptions.value[0]),
      matchmakerButton: computed(
        () => store.state.config.buttons.matchmakerButton,
      ),
      matchmakerHelp: computed(() => store.state.config.buttons.matchmakerHelp),
      title: computed(() => store.state.config.nameShort),
    }
  },
})
</script>
