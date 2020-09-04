<template>
  <base-item-columns>
    <template slot="default">
      <strong> {{ match.name }} </strong>
      <div class="full-width q-pt-sm">
        {{ formatDate(match.endDate) }}
      </div>
    </template>
    <template slot="left" class="row">
      <div class="row" @click="$router.push('/profile/' + left.id)">
        <base-avatar hide-rank v-bind="left" />
        <div class="col q-px-md" :class="`text-${leftColor}`">
          <div>
            <strong> {{ left.cgeUsername }} </strong>
          </div>
          <q-chip :color="leftColor">
            <q-icon v-if="leftIcon.length" :name="leftIcon" />
            <span v-else>{{ left.score }}</span>
          </q-chip>
        </div>
      </div>
    </template>
    <template slot="right">
      <div class="row" @click="$router.push('/profile/' + right.id)">
        <div class="col q-px-md" :class="`text-${rightColor}`">
          <div>
            <strong> {{ right.cgeUsername }} </strong>
          </div>
          <q-chip :color="rightColor">
            <q-icon v-if="rightIcon.length" :name="rightIcon" />
            <span v-else>{{ right.score }}</span>
          </q-chip>
        </div>
        <base-avatar hide-rank v-bind="right" />
      </div>
    </template>
  </base-item-columns>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/composition-api'
import moment from 'moment'
import { MatchInterface } from '../store/modules/stats'
import { OpponentInterface } from '../store/modules/matchmaker'
import store from '../store'

export default defineComponent({
  name: 'MatchRow',
  props: {
    match: {
      type: Object as PropType<MatchInterface>,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
    gameOrder: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const left = computed(() =>
      Object.assign(
        {},
        props.match.opponents.filter((o) =>
          props.gameOrder ? o.position == 0 : o.id == props.playerId,
        )[0],
      ),
    )
    const right = computed(() =>
      Object.assign(
        {},
        props.match.opponents.filter((o) =>
          props.gameOrder ? o.position != 0 : o.id != props.playerId,
        )[0],
      ),
    )

    const getColor = (o: OpponentInterface): string => {
      if (o.isWin) {
        return 'primary'
      }
      if (o.isResigned) {
        return 'warning'
      }
      if (o.isExpired) {
        return 'negative'
      }
      return 'accent'
    }
    const getIcon = (o: OpponentInterface): string => {
      if (o.isResigned) {
        return (
          store.state.config.stats.filter((s) => s.label == 'Resigns')[0]
            ?.icon || ''
        )
      }
      if (o.isExpired) {
        return (
          store.state.config.stats.filter((s) => s.label == 'Timeouts')[0]
            ?.icon || ''
        )
      }
      return ''
    }
    return {
      left,
      leftColor: computed(() => getColor(left.value)),
      leftIcon: computed(() => getIcon(left.value)),
      right,
      rightColor: computed(() => getColor(right.value)),
      rightIcon: computed(() => getIcon(right.value)),
      formatDate: (date: string) => moment.utc(date).local().calendar(),
    }
  },
})
</script>
