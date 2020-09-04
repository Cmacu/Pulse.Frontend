import { Notify } from 'quasar'

Notify.setDefaults({
  message: '',
  position: 'top',
  color: 'negative',
  textColor: 'white',
  progress: true,
  timeout: 15 * 1000,
  actions: [{ icon: 'close', color: 'white' }],
})
