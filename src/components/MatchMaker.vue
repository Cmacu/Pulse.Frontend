<template>
  <base-card
    :icon="matchmakerButton.icon"
    :title="projectName"
    :subtitle="matchmakerButton.label"
    :loading="loading"
  >
    <template slot="extra">
      <div class="row items-center q-gutter-sm">
        <q-icon v-if="!$q.screen.lt.sm" name="o_alarm" size="25px" />
        <div>{{ matchmakerTimeout }} min</div>
        <div style="width: 60px;">
          <q-slider
            :value="matchmakerTimeout"
            :min="10"
            :max="60"
            label
            @change="updateTimeout"
            color="accent"
          />
        </div>
        <base-btn v-bind="matchmakerHelp" round flat />
      </div>
    </template>
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center">
        <div class="text-overline full-width text-center">
          {{ match.opponents[0].cgeUsername }}
        </div>
      </q-card-section>
      <q-card-section class="col-2 flex flex-center">
        <div v-if="timer">{{ timer }}</div>
        <div
          v-if="match.name"
          class="text-center text-overline"
          style="margin: -10px 0px;"
        >
          {{ match.name }}
        </div>
      </q-card-section>
      <q-card-section class="col-5 flex flex-center">
        <div class="text-overline full-width text-center">
          {{ match.opponents[1].cgeUsername }}
        </div>
      </q-card-section>
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center">
        <base-avatar
          v-bind="match.opponents[0]"
          class="cursor-pointer"
          size="90px"
          @click="
            viewProfile(
              match.opponents.length ? match.opponents[0].id.toString() : '',
            )
          "
        />
      </q-card-section>
      <q-card-section class="flex col-2 flex-center">
        <!-- <q-spinner-infinity
          v-if="match.showSearching"
          size="xl"
          color="primary"
        /> -->
        <q-spinner-puff v-if="match.showSearching" size="xl" color="primary" />
        <div v-else class="text-grey">
          VS
        </div>
      </q-card-section>
      <q-card-section class="col-5 flex flex-center">
        <base-avatar
          class="cursor-pointer"
          v-bind="match.opponents[1]"
          size="90px"
          @click="
            viewProfile(
              match.opponents.length ? match.opponents[1].id.toString() : '',
            )
          "
        />
      </q-card-section>
    </q-card-section>
    <q-card-section
      style="height: 60px; overflow-y: hidden;"
      class="text-center text-overline"
    >
      <MatchRandomLoader v-if="match.showSearching" />
      <div v-else v-html="match.instructions" />
    </q-card-section>

    <q-card-actions align="evenly" class="q-pb-md">
      <q-btn
        v-bind="match"
        size="lg"
        class="q-mb-md full-width"
        @click="toggleMatchmaking"
      />
      <q-btn-group spread flat class="full-width">
        <base-btn
          v-for="mode of modes"
          :key="mode.label"
          v-bind="mode"
          :stack="$q.screen.lt.sm"
          dense
        />
      </q-btn-group>
    </q-card-actions>
  </base-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  // onUnmounted,
} from '@vue/composition-api'
import store from 'src/store'
import { formatSeconds } from '../utils/format'
import router from '../router'
import { MATCH_STATES } from 'src/store/modules/config'

export default defineComponent({
  name: 'MatchMaker',
  components: {
    MatchRandomLoader: () => import('components/MatchRandomLoader.vue'),
  },
  setup() {
    const seconds = computed(() => store.state.timer.secondsLeft)
    return {
      MATCH_STATES,
      matchmakerTimeout: computed(() => store.state.settings.matchmakerTimeout),
      updateTimeout: store.dispatch.settings.updateTimeout,
      match: computed(() => store.state.matchmaker),
      timer: computed(() =>
        seconds.value > 0 ? formatSeconds(seconds.value) : '',
      ),
      loading: computed(() => store.state.matchmaker.loading),
      matchmakerButton: computed(() => store.state.config.buttons.matchmaker),
      matchmakerHelp: computed(() => store.state.config.buttons.matchmakerHelp),
      projectName: computed(() => store.state.config.projectName),
      modes: computed(() => store.state.config.matchModes),
      toggleMatchmaking: store.dispatch.matchmaker.toggle,
      viewProfile: (playerId: string) => router.push(`/profile/${playerId}`),
    }
  },
})
</script>
