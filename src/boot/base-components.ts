import Vue from 'vue'
import TrendChart from 'vue-trend-chart'

const requireComponent = require.context(
  '../components',
  false,
  /base([A-Z-]\w+)+\.(vue|js|ts)$/,
)

requireComponent.keys().forEach((fileName: string) => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  Vue.component(componentName, componentConfig.default || componentConfig)
})
// Add Trend Chart
Vue.use(TrendChart)
