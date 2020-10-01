<template>
  <section class="absolute-top page-container text-dark q-pt-md q-px-sm">
    <div class="row items-center" style="font-size: 0.6rem; margin-top: -10px;">
      <div class="col text-right">{{ attacker }}</div>
      <q-icon class="col-auto" name="clear" color="primary" size="1rem" />
      <div class="col">{{ defender }}</div>
    </div>
    <div class="row no-wrap">
      <div class="col column">
        <div class="row q-gutter-sm">
          <InfoCard
            name="discard"
            :counter="discardCount"
            @click="showDiscard = true"
          />

          <InfoCard
            name="siege"
            :counter="siegeCardsCount"
            @click="showRules = true"
          />
        </div>
      </div>

      <div class="col-3" @click="showRules = true">
        <q-img src="/symbols/SchottenTotten2InGame.png" contain />
      </div>

      <div
        class="col column text-right justify-between"
        style="font-size: 0.6rem; line-height: 1;"
      >
        <div>
          <q-btn-dropdown align="right" :color="color" size="0.5rem">
            <template v-slot:label>
              <div class="column items-end text-right">
                <div>{{ player }} turn</div>
                <div v-if="isCurrentPlayer">Play a card {{ prepare }}</div>
              </div>
            </template>
            <q-list style="font-size: 16px;">
              <q-item
                clickable
                v-ripple
                v-close-popup
                class="q-pa-md"
                @click="showRules = true"
              >
                <q-item-section side>
                  <q-icon name="menu_book" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Rules</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                v-close-popup
                class="q-pa-md"
                @click="showSettings = true"
              >
                <q-item-section side>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Settings</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                v-close-popup
                class="q-pa-md"
                @click="showResign = true"
              >
                <q-item-section side>
                  <q-icon name="clear" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-negative">Resign</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                disable
                v-close-popup
                class="q-pa-md text-warning"
              >
                <q-item-section side>
                  <q-icon name="warning" color="warning" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-warning">Report</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="row q-mt-sm justify-end">
          <q-icon
            v-for="n in 3"
            :key="n"
            name="local_fire_department"
            :color="isAttacker ? 'accent' : 'primary'"
            :class="{ faded: n > oilCount }"
            size="2.2rem"
          />
        </div>
      </div>
      <!-- RULES DIALOG -->
      <q-dialog v-model="showRules" auto-close>
        <Rules :side="side" />
      </q-dialog>

      <!-- RESIGN DIALOG -->
      <q-dialog v-model="showResign">
        <q-card>
          <q-card-section class="row items-center">
            <div>Resign</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator inset />

          <q-card-section>
            Are you sure you want to resign? This means you will lose the game
            and your opponent will win.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Keep Playing" v-close-popup />
            <q-btn
              flat
              label="Resign"
              color="negative"
              v-close-popup
              @click="atResignClick"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- DISCARD DIALOG -->
      <q-dialog v-model="showDiscard" auto-close>
        <q-card class="page-container q-pa-md">
          <q-card-section title class="row items-center">
            <div class="text-special-13 text-center">DISCARD CARDS</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator class="q-mb-md" inset />
          <table class="schotten2-discards">
            <tr v-for="rank in ranks" :key="rank">
              <td v-for="(suit, suitIndex) in suits" :key="suitIndex">
                <div
                  class="row justify-center items-end"
                  :class="getDiscardClass(suitIndex, rank)"
                >
                  <div
                    class="col text-right"
                    :style="{
                      color: suit.color,
                    }"
                  >
                    {{ rank }}
                  </div>
                  <div
                    class="col text-left"
                    :style="{ 'padding-bottom': '2px' }"
                  >
                    <q-img
                      :src="`/st2/symbols/${suitIndex}.png`"
                      height="1rem"
                      contain
                    />
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div>
            <q-separator class="q-my-md" inset />
            <div class="row justify-between">
              <div class="text-bold">Legend:</div>
              <div class="q-px-sm">Unknown</div>
              <div class="q-px-sm faded">Discard</div>
              <div class="q-px-sm faded bg-black">In Play</div>
              <div class="q-px-sm faded add-border">In Hand</div>
            </div>
          </div>
        </q-card>
      </q-dialog>

      <!-- SETTINGS DIALOG -->
      <q-dialog v-model="showSettings" auto-close>
        <q-card class="page-container">
          <q-card-section class="row items-center">
            <div>Settings</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-separator inset />
          <q-list>
            <q-item-label header>Sound</q-item-label>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label class="text-accent"
                  >Notification sound</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-toggle color="accent" v-model="chime" :val="true" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-dialog>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { suits } from './design'
import { game } from './game'

export default defineComponent({
  name: 'Info',
  components: {
    InfoCard: () => import('./InfoCard.vue'),
    Rules: () => import('./Rules.vue'),
  },
  props: {
    attacker: {
      type: String,
      required: true,
    },
    defender: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chime = ref(false)
    const showDiscard = ref(false)
    const showRules = ref(false)
    const showSettings = ref(false)
    const showResign = ref(false)
    const discardCards = computed(() => game.state.api.discardCards || [])
    const discardCount = computed(
      () => game?.state?.api?.discardCards?.length || 0,
    )
    const ranks: number[] = []
    for (let i = 0; i < 12; i++) ranks.push(i)

    const isCurrentPlayer = computed(() => game.state.api.isCurrentPlayer)
    const isAttacker = computed(() => game.state.api.isAttacker)
    const opponentName = computed(() => {
      const name = game.state.api.isAttacker ? props.defender : props.attacker
      return name || 'Opponent'
    })

    return {
      chime,
      ranks,
      suits,
      showDiscard,
      showRules,
      showSettings,
      showResign,
      discardCards,
      discardCount,
      isAttacker,
      isCurrentPlayer,
      side: computed(() => (isAttacker.value ? 'attack' : 'defense')),
      prepare: computed(() => {
        if (!isCurrentPlayer || !game.state.api.enablePreparation) return ''
        return isAttacker.value ? 'or Retreat' : 'or Use Oil'
      }),
      player: computed(() =>
        isCurrentPlayer.value ? 'Your' : `${opponentName.value}'s`,
      ),
      color: computed(() => {
        if (!isCurrentPlayer.value) return 'dark'
        return isAttacker.value ? 'accent' : 'primary'
      }),
      siegeCardsCount: computed(() => game.state.api.siegeCardsCount || 0),
      oilCount: computed(() => game.state.api.oilCount || 0),
      getDiscardClass: (suit: number, rank: number) => {
        if (
          game.state.api.handCards &&
          game.state.api.handCards.find((x) => x.suit == suit && x.rank == rank)
        )
          return 'faded add-border'
        if (
          discardCards.value &&
          discardCards.value.find((x) => x.suit == suit && x.rank == rank)
        )
          return 'faded'
        if (!game?.state?.api?.sections) return ''
        for (const section of game.state.api.sections) {
          for (const x of section.attack)
            if (x.suit == suit && x.rank == rank) return 'faded bg-black'
          for (const x of section.defense)
            if (x.suit == suit && x.rank == rank) return 'faded bg-black'
        }
        return ''
      },
      atResignClick: () => game.actions.resign(),
    }
  },
})
</script>
