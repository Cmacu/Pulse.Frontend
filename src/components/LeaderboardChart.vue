<template>
  <base-card
    :icon="buttons.leaderboardChart.icon"
    :title="buttons.leaderboardChart.label"
    :loading="loading"
  >
    <template slot="extra">
      <div class="row q-gutter-sm">
        <base-btn :icon="showPlayersIcon" flat round @click="togglePlayers" />
        <base-btn v-bind="buttons.leaderboardChartHelp" flat round />
      </div>
    </template>
    <highcharts :options="options" ref="historyChart"></highcharts>
  </base-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  watch,
  PropType,
} from '@vue/composition-api'
import store from 'src/store'
import Highcharts, { Options, SeriesSplineOptions } from 'highcharts'
import darkUnica from 'highcharts/themes/dark-unica'
import { Chart } from 'highcharts-vue'
import api from 'src/utils/api'
import { LeaderboardLog } from 'src/store/modules/stats'
darkUnica(Highcharts)

type ChartPoint = { x: number; y: number; z: number }
type PlayerSeries = { [key: string]: ChartPoint[] }
type LogSeries = { player: string; data: ChartPoint[] }

const parseLogs = (logs: LeaderboardLog[]): LogSeries[] => {
  const series: PlayerSeries = {}
  logs.forEach((log) => {
    if (log.leaderboardRating <= 500) return
    const player = log.username
    if (!Object.prototype.hasOwnProperty.call(series, player)) {
      series[player] = []
    }
    series[player].push({
      x: new Date(log.createdAt).getTime(),
      y: log.leaderboardRating,
      z: log.rank,
    })
  })
  const logSeries: LogSeries[] = []
  Object.keys(series).forEach((player) => {
    logSeries.push({
      player,
      data: series[player].sort(sortSeries),
    })
  })
  return logSeries.sort((a, b) => b.data.slice(-1)[0].y - a.data.slice(-1)[0].y)
}

const sortSeries = (tranA: ChartPoint, tranB: ChartPoint): number => {
  if (tranA.x > tranB.x) return 1
  if (tranA.x < tranB.x) return -1

  return 0
}

export default defineComponent({
  name: 'LeaderboardChart',
  props: {
    players: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  components: {
    highcharts: Chart,
  },
  setup(props) {
    const highchartArgs = ref([true, true, true])
    const loading = ref(true)
    const series = ref<LogSeries[]>([])
    const options = ref<Options>(
      Highcharts.merge(
        {},
        {
          chart: {
            height: 400,
          },
          xAxis: {
            type: 'datetime',
            // minTickInterval: 365 * 24 * 36e5,
          },
          yAxis: {
            allowDecimals: false,
            min: 1000,
            // max: 10000,
            title: {
              text: 'Rating',
            },
            opposite: true,
            gridLineWidth: 0.3,
          },
          title: {
            text: 'Leaderboard Chart',
            style: { display: 'none' },
          },
          credits: {
            enabled: false,
          },
          series: [],
        },
      ),
    )

    const showPlayers = ref(true)

    const updatePlayers = () => {
      loading.value = true
      const playerSeries: SeriesSplineOptions[] = []
      series.value.forEach((log) => {
        if (!props.players.includes(log.player)) return
        playerSeries.push({
          name: log.player,
          type: 'spline',
          marker: {
            enabled: false,
          },
          data: log.data,
          tooltip: {
            headerFormat:
              '<span style="font-size: 11px;color:{series.color}">{series.name}</span><br>',
            pointFormat: '<b>{point.x:%B %e, %Y}: {point.y} (#{point.z})</b>',
            valueDecimals: 0,
          },
        })
      })
      options.value.series = playerSeries
      loading.value = false
    }

    watch(() => props.players, updatePlayers)

    onMounted(async () => {
      const response = await api.getLeaderboardLog('')
      series.value = parseLogs(response.data)
      updatePlayers()
    })
    return {
      options,
      highchartArgs,
      showPlayersIcon: computed(() =>
        showPlayers.value ? 'visibility' : 'visibility_off',
      ),
      loading,
      buttons: computed(() => store.state.config.buttons),
      togglePlayers: () => {
        showPlayers.value = !showPlayers.value
        options.value?.series?.forEach((x) => {
          x.visible = showPlayers.value
        })

        Highcharts.charts
          .filter(
            (chart) => chart?.userOptions?.title?.text == 'Leaderboard Chart',
          )?.[0]
          ?.update(options.value)
      },
    }
  },
})
</script>
