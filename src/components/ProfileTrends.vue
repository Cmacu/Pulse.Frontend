<template>
  <section
    class="full-width trend-stats row"
    :class="`trend-${name.toLowerCase()}`"
  >
    <div class="col-4 col-sm-2 text-center flex items-end justify-end q-pb-sm">
      <div class="text-overline text-special-06 full-width">
        {{ name }}
      </div>
      <div class="text-special-30 full-width">
        {{ count }}
      </div>
      <div class="text-special-06 full-width">
        {{ date }}
      </div>
    </div>
    <div class="col items-end" style="height: 85px;">
      <trend-chart
        v-if="data.length"
        :datasets="[dataset]"
        :min="0"
        :max="10"
        :interactive="true"
        padding="5 0 0"
        @mouse-move="onMouseMove"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from '@vue/composition-api'
import { TrendDataPoint } from 'src/store/modules/stats'

export interface TrendDataset<T> {
  data: Array<T>
  smooth?: boolean
  className?: string
  stroke?: string
  fill?: string
  opacity?: number
  showPoints?: number
}

export default defineComponent({
  name: 'ProfileTrends',
  props: {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Array as PropType<TrendDataPoint[]>,
      default: [],
    },
    total: {
      type: Number,
      default: 400,
    },
    period: {
      type: String,
      default: 'this season',
    },
  },
  setup(props) {
    const dataset = computed(() => ({
      data: props.data,
      className: 'trend-area',
      smooth: false,
      stroke: false,
      fill: true,
      opacity: 1,
    }))

    const showTotal = ref('')
    const showDate = ref('')

    const onMouseMove = (params: TrendDataset<TrendDataPoint>) => {
      if (!params || !params.data.length) {
        showTotal.value = ''
        showDate.value = ''
        return
      }
      showTotal.value = params.data[0].value.toString()
      showDate.value = params.data[0].label
    }

    return {
      dataset,
      count: computed(() =>
        showTotal.value.length ? showTotal.value : props.total.toString(),
      ),
      date: computed(() =>
        showDate.value.length ? showDate.value : props.period.toString(),
      ),
      onMouseMove,
    }
  },
})
</script>

<style lang="sass">
.trend-matches
  &.trend-stats
    border-bottom: 1px solid $accent
  .text-special-30
    color: $accent
  .trend-area .fill
    fill: $accent
.trend-wins
  &.trend-stats
    border-bottom: 1px solid $positive
  .text-special-30
    color: $positive
  .trend-area .fill
    fill: $positive
</style>
