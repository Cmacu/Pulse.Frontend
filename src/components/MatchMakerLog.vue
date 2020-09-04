<template>
  <base-card
    :icon="queueButton.icon"
    :subtitle="queueStatus"
    :title="queueButton.label"
    :loading="loading"
  >
    <template slot="extra">
      <base-btn v-bind="queueHelp" round flat />
    </template>
    <q-card-actions align="evenly" class="q-pb-none">
      <base-btn
        v-for="(day, index) in weekdays"
        :key="day"
        size="14px"
        :class="{
          'btn-active': day == todaysDay,
          'btn-today': index == currentDay,
        }"
        flat
        color="info"
        :label="$q.screen.lt.sm ? day.substring(0, 3) : day"
        @click="getAggregateLog(index)"
      />
    </q-card-actions>
    <q-card-section class="q-pa-none" style="height: 160px;">
      <svg
        style="width: 0; height: 0; position: absolute;"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="avgFill" x1="1" x2="1" y1="0" y2="1">
            <stop
              offset="0%"
              class="trend-gradient-start"
              stop-color="#111111"
            ></stop>
            <stop
              offset="100%"
              class="trend-gradient-stop"
              stop-color="#111111"
            ></stop>
          </linearGradient>
          <marker
            id="marker-now"
            markerWidth="4"
            markerHeight="4"
            refX="2"
            refY="2"
          >
            <circle cx="2" cy="2" r="2" stroke="none" fill="#f00" />
          </marker>
        </defs>
      </svg>
      <trend-chart
        v-if="!loading"
        :datasets="datasets"
        :labels="labels"
        :min="0"
        :max="max"
        :grid="grid"
      />
    </q-card-section>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from '@vue/composition-api'
import store from '../store'
import api from '../utils/api'
import { utcDateHourFormat } from 'src/utils/format'

export default defineComponent({
  name: 'MatchMakerLog',
  components: {},
  setup() {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const loading = ref<boolean>(true)
    const today = new Date()
    const currentDay = ref<number>(today.getDay())
    const todaysDay = weekdays[currentDay.value]

    const intervals: number[] = Array.from(
      new Array(11),
      (val: number, i: number) => i + 1,
    )
    // .filter((val: number) => val % 2 == 0)
    const am: string[] = intervals.map((h) => `${h}am`)
    am.push('12pm')
    const pm: string[] = intervals.map((h) => `${h}pm`)
    const hours = am.concat(pm)
    hours.unshift('12am')
    hours.push('12am')
    // hours[4] = ''

    const max = ref<number>(15) // TODO: Get max value
    const average: number[] = [0, 0]
    const current: number[] = [0, 0]

    const datasets = ref([
      {
        data: average,
        smooth: true,
        className: 'trend-average',
        stroke: true,
        fill: true,
        opacity: 0.1,
      },
      {
        data: current,
        className: 'trend-today',
        smooth: true,
        stroke: false,
        // fill: true,
        // showPoints: true,
      },
    ])

    const getAggregateLog = async (weekday: number = today.getDay()) => {
      loading.value = true
      const now = new Date()
      const currentWeekday = now.getDay()
      if (currentWeekday === weekday) {
        await getActivityLog()
      }
      let dayDiff = currentWeekday - weekday
      if (dayDiff <= 0) dayDiff += 7
      const from = new Date(now.setDate(now.getDate() - dayDiff))
      const utcFrom = utcDateHourFormat(from)
      const to = new Date(from.setDate(from.getDate() + 1))
      const utcTo = utcDateHourFormat(to)
      const response = await api.getMatchmakerAggregate(utcFrom, utcTo)
      const averageResults = response.data
      average.splice(0, average.length, ...averageResults)
      datasets.value[1].stroke = weekdays[weekday] === todaysDay // shows and hides the activity chart
      currentDay.value = weekday
      loading.value = false
    }

    const getActivityLog = async () => {
      const to = new Date()
      const from = new Date(to.getTime() - to.getHours() * 60 * 60 * 1000)
      const utcFrom = utcDateHourFormat(from)
      const utcTo = utcDateHourFormat(to)
      const response = await api.getMatchmakerActivity(utcFrom, utcTo)
      const todayResults = response.data
      if (todayResults.length == 0) {
        todayResults.push(0)
      }
      if (todayResults.length == 1) {
        todayResults[1] = todayResults[0]
      }
      current.splice(0, current.length, ...todayResults)
    }

    onMounted(getAggregateLog)

    return {
      todaysDay,
      loading,
      currentDay,
      getAggregateLog,
      queueButton: computed(() => store.state.config.buttons.queue),
      queueHelp: computed(() => store.state.config.buttons.queueHelp),
      queueStatus: computed(() => 'More busy than usual'),
      weekdays,
      labels: {
        xLabels: hours,
      },
      max,
      grid: {
        // verticalLines: true,
      },
      datasets,
    }
  },
})
</script>

<style lang="sass">
.btn-active
  text-decoration: underline
  text-underline-position: below
.btn-today
  color: $primary !important

.x-labels
  visibility: hidden
  fill: $info

.x-labels .label:first-child
  visibility: visible

@media(min-width: $breakpoint-sm-min)
  .x-labels .label:nth-child(2n+1)
    visibility: visible

@media(max-width: $breakpoint-xs-max)
  .x-labels .label:nth-child(4n + 1)
    visibility: visible

.grid .vertical .line
  stroke: $info
  stroke-width: 2
  opacity: .05

.trend-gradient-start
  stop-color: $primary

.trend-gradient-stop
  stop-color: $secondary

#marker-now circle
  fill: $primary

.trend-today path
  marker-end: url(#marker-now)

.trend-average
  .fill
    fill: url(#avgFill)
.trend-today
  .stroke
    stroke: $primary
    stroke-width: 2px
</style>
