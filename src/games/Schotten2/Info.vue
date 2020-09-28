<template>
  <section class="absolute-top page-container text-dark q-pt-md q-px-sm">
    <div class="row justify-between no-wrap">
      <div class="row q-gutter-sm">
        <InfoCard
          name="discard"
          :counter="discardCount"
          @click="showDiscard = true"
        />
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
                <div class="q-px-sm">In Deck</div>
                <div class="q-px-sm faded">Discard</div>
                <div class="q-px-sm faded bg-black">Played</div>
                <div class="q-px-sm faded add-border">In Hand</div>
              </div>
            </div>
          </q-card>
        </q-dialog>

        <InfoCard
          name="siege"
          :counter="siegeCardsCount"
          @click="showHelp = true"
        />
        <q-dialog v-model="showHelp" auto-close>
          <Rules :side="side" />
        </q-dialog>
      </div>

      <div
        class="text-right"
        style="font-size: 0.7rem; line-height: 1.5rem; margin-top: -10px;"
      >
        <div>
          <router-link to="/settings" class="text-dark">
            <span :class="{ 'text-bold': isAttacker }">{{
              players[0] ? players[0].username : ''
            }}</span>
            <q-icon name="clear" color="primary" size="1rem" />
            <span :class="{ 'text-bold': !isAttacker }">{{
              players[1] ? players[1].username : ''
            }}</span>
            <q-icon name="settings" class="q-pl-sm" size="1.3rem" />
          </router-link>
        </div>

        <div>
          <a
            href="https://www.knizia.de/"
            class="text-dark"
            target="_blank"
            no-caps
          >
            <span>Schotten Totten 2</span>
            <span> by </span>
            <span>Reiner Knizia</span>
            <q-icon name="open_in_new" class="q-pl-sm" size="1.3rem" />
          </a>
        </div>

        <div :class="activePlayerClass" @click="showOptions = true">
          <span>{{ player }} turn</span>
          <span v-if="isCurrentPlayer">: Play a card {{ prepare }}</span>
          <q-icon name="arrow_drop_down_circle" class="q-pl-sm" size="1.3rem" />
        </div>
        <q-dialog v-model="showOptions" auto-close>
          <q-card>
            <q-card-section class="row items-center">
              <div>Options</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-separator inset />
            <q-list>
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
          </q-card>
        </q-dialog>
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
      </div>
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
    players: {
      type: Array as PropType<OpponentInterface[]>,
      default: () => [],
    },
  },
  setup(props) {
    const showDiscard = ref(false)
    const showHelp = ref(false)
    const showOptions = ref(false)
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
      const name = game.state.api.isAttacker
        ? props.players[1]?.username
        : props.players[0]?.username
      return name || 'Opponent'
    })

    return {
      ranks,
      suits,
      showDiscard,
      showHelp,
      showOptions,
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
      activePlayerClass: computed(() => {
        if (!isCurrentPlayer.value) return ''
        return isAttacker.value
          ? 'text-bold text-accent'
          : 'text-bold text-primary'
      }),
      lastDiscardCard: computed(() =>
        discardCount.value ? discardCards.value[discardCount.value - 1] : null,
      ),
      siegeCardsCount: computed(() => game.state.api.siegeCardsCount || 0),
      opponentCardsCount: computed(
        () => game.state.api.opponentCardsCount || 0,
      ),
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
