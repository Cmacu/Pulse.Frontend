<template>
  <base-card
    :icon="chordButton.icon"
    :title="chordButton.label"
    subtitle="Sample data only"
    :loading="loading"
  >
    <template slot="extra">
      <base-btn flat round icon="help_outline" :tooltip="chordButton.tooltip" />
    </template>
    <!-- Dependency Wheel Chart -->
    <highcharts :options="chordOptions"></highcharts>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { store } from 'src/store'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import Sankey from 'highcharts/modules/sankey'
import highchartsDependencyWheel from 'highcharts/modules/dependency-wheel'
import darkUnica from 'highcharts/themes/dark-unica'
import { Chart } from 'highcharts-vue'
import { Screen } from 'quasar'
highchartsMore(Highcharts)
Sankey(Highcharts)
highchartsDependencyWheel(Highcharts)
darkUnica(Highcharts)

export default defineComponent({
  name: 'ProfileChord',
  components: {
    highcharts: Chart,
  },
  setup() {
    const loading = ref<boolean>(false)
    return {
      loading,
      chordButton: computed(() => store.state.config.buttons.profileChord),
      chordOptions: {
        colors: [
          '#e7c632',
          '#72a10c',
          '#351213',
          '#115192',
          '#8bbd23',
          '#3c3039',
          '#5e9292',
          '#296eb3',
          '#39303c',
          '#6b2707',
          '#3e550b',
          '#6e5f1c',
          '#12273b',
        ],
        chart: {
          height: computed(() => (Screen.gt.xs ? 800 : 400)),
        },
        title: {
          text: '',
        },
        accessibility: {
          point: {
            valueDescriptionFormat:
              '{index}. From {point.from} to {point.to}: {point.weight} matches.',
          },
        },
        series: [
          {
            type: 'dependencywheel',
            name: 'Leaders and Wonders Series',
            dataLabels: {
              // color: '#BBB',
              textPath: {
                enabled: true,
                attributes: {
                  dy: 5,
                },
              },
              distance: 10,
            },
            size: '90%',
            keys: ['from', 'to', 'weight'],
            data: [
              ['Gates', 'Theresa', 5],
              ['Gates', 'Isabella', 1],
              ['Gates', 'Saladin', 1],
              ['Gates', 'Eleanor', 1],
              ['Cleopatra', 'Sun Tzu', 1],
              ['Gandhi', 'Sun Tzu', 1],
              ['Cleopatra', 'Isabella', 5],
              ['Cleopatra', 'Eleanor', 1],
              ['Gandhi', 'Isabella', 1],
              ['Gandhi', 'Eleanor', 1],
              ['Jan Zizka', 'Sun Tzu', 1],
              ['Gandhi', 'Saladin', 5],
              ['Jan Zizka', 'Isabella', 1],
              ['Jan Zizka', 'Saladin', 1],
              ['Jan Zizka', 'Eleanor', 5],
              ['Sun Tzu', 'Einstein', 2],
              ['Sun Tzu', 'Sid Meier', 1],
              ['Sun Tzu', 'Michelangelo', 1],
              ['Sun Tzu', 'Jobs', 3],
              ['Isabella', 'Einstein', 1],
              ['Isabella', 'Sid Meier', 3],
              ['Isabella', 'Theresa', 3],
              ['Isabella', 'Michelangelo', 3],
              ['Isabella', 'Jobs', 1],
              ['Saladin', 'Sid Meier', 1],
              ['Saladin', 'Michelangelo', 3],
              ['Saladin', 'Jobs', 1],
              ['Eleanor', 'Einstein', 1],
              ['Eleanor', 'Sid Meier', 1],
              ['Eleanor', 'Michelangelo', 2],
              ['Eleanor', 'Jobs', 7],
              ['Jobs', 'Chaplin', 5],
              ['Jobs', 'Newton', 1],
              ['Jobs', 'Joan', 3],
              ['Einstein', 'Chaplin', 5],
              ['Einstein', 'Newton', 1],
              ['Einstein', 'Joan', 3],
              ['Sid Meier', 'Chaplin', 5],
              ['Sid Meier', 'Newton', 1],
              ['Sid Meier', 'Joan', 3],
              ['Theresa', 'Chaplin', 5],
              ['Theresa', 'Newton', 1],
              ['Theresa', 'Joan', 3],
              ['Michelangelo', 'Chaplin', 5],
              ['Michelangelo', 'Newton', 3],
              ['Michelangelo', 'Joan', 3],
              ['Joan', 'Gates', 1],
            ],
          },
        ],
        credits: {
          enabled: false,
        },
      },
    }
  },
})
</script>

<style lang="sass">
.highcharts-root
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif !important

body .highcharts-root .highcharts-background
  fill: white

body.body--dark .highcharts-root .highcharts-background
  fill: $dark !important;

.highcharts-label text
  color: $primary !important
  fill: $primary !important
</style>
