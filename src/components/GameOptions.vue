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
          <span class="text-accent text-center">Title</span>
          <q-select
            v-model="gameTitle"
            :options="titleOptions"
            behavior="dialog"
            color="accent"
            borderless
            style="width: 200px;"
          />
        </div>
        <div>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-accent">Mode</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select
                  v-model="gameMode"
                  :options="modeOptions"
                  behavior="dialog"
                  color="accent"
                  borderless
                  style="width: 200px;"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="text-accent">Speed</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select
                  v-model="gameSpeed"
                  :options="speedOptions"
                  behavior="dialog"
                  color="accent"
                  borderless
                  style="width: 200px;"
                />
              </q-item-section>
            </q-item>
          </q-list>
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
      '<img src="/symbols/SchottenTotten2.png" height="200" />',
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
