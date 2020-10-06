<template>
  <section
    class="full-width trend-stats row"
    :class="`trend-${areaName.toLowerCase()}`"
  >
    <div
      class="col-4 col-sm-2 text-center flex items-end justify-end q-pb-sm cursor-pointer"
      @click="onClick"
    >
      <div class="text-overline text-special-06 full-width">
        {{ name }}
      </div>
      <div class="text-special-20 full-width">
        {{ count }}
      </div>
      <div class="text-special-06 full-width">
        {{ date }}
      </div>
    </div>
    <div class="col items-end" style="height: 65px;">
      <trend-chart
        v-if="datasets.length"
        :datasets="datasets"
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
    areaName: {
      type: String,
      default: '',
    },
    lineName: {
      type: String,
      default: '',
    },
    areaData: {
      type: Array as PropType<TrendDataPoint[]>,
      default: () => [],
    },
    lineData: {
      type: Array as PropType<TrendDataPoint[]>,
      default: () => [],
    },
    areaTotal: {
      type: Number,
      default: 400,
    },
    lineTotal: {
      type: Number,
      default: 400,
    },
    period: {
      type: String,
      default: 'this season',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10,
    },
  },
  setup(props) {
    const datasets = computed(() => {
      const data = []
      if (props.areaData.length > 1)
        data.push({
          data: props.areaData,
          className: 'trend-area',
          smooth: false,
          stroke: false,
          fill: true,
          opacity: 0.5,
        })
      if (props.lineData.length > 1)
        data.push({
          data: props.lineData,
          className: 'trend-line',
          smooth: false,
          stroke: true,
          fill: false,
          opacity: 1,
        })
      return data
    })

    const showTotal = ref('')
    const showDate = ref('')
    const showArea = ref(true)
    const name = computed(() =>
      showArea.value ? props.areaName : props.lineName,
    )
    const total = computed(() =>
      showArea.value ? props.areaTotal : props.lineTotal,
    )
    const index = computed(() => (showArea.value ? 0 : 1))

    const onMouseMove = (params: TrendDataset<TrendDataPoint>) => {
      if (!params || !params.data.length) {
        showTotal.value = ''
        showDate.value = ''
        return
      }
      showTotal.value = params.data[index.value].value.toString()
      showDate.value = params.data[index.value].label
    }

    const onClick = () =>
      (showArea.value = props.lineName.length ? !showArea.value : true)

    return {
      datasets,
      name,
      total,
      count: computed(() =>
        showTotal.value.length ? showTotal.value : total.value.toString(),
      ),
      date: computed(() =>
        showDate.value.length ? showDate.value : props.period.toString(),
      ),
      onMouseMove,
      onClick,
    }
  },
})
</script>

<style lang="sass">
.trend-matches
  &.trend-stats
    border-bottom: 1px solid $accent
  .text-special-20
    color: $accent
  .trend-area .fill
    fill: $accent
.trend-wins
  &.trend-stats
    border-bottom: 1px solid $positive
  .text-special-20
    color: $positive
  .trend-area .fill
    fill: $positive
.trend-rating
  &.trend-stats
    border-bottom: 1px solid $info
  .text-special-20
    color: $info
  .trend-area .fill
    fill: $info
</style>
