import { date } from 'quasar'

export const dateFormat = 'MM/DD/YYYY'
export const timeFormat = 'hh:mm A'
export const formatDate = (value: number | string | Date): string =>
  date.formatDate(value, dateFormat)

export const formatTime = (value: string | Date): string =>
  date.formatDate(value, timeFormat)

export const formatDateTime = (value: string | Date): string =>
  date.formatDate(value, dateFormat + ' ' + timeFormat)

export const utcFormat = (value: string): number => {
  const valueDate = new Date(value)
  return Date.UTC(
    valueDate.getUTCFullYear(),
    valueDate.getUTCMonth(),
    valueDate.getUTCDate(),
    // valueDate.getUTCHours(),
    // valueDate.getUTCMinutes(),
    // valueDate.getUTCSeconds(),
  )
}

export const utcDateHourFormat = (date: Date): string =>
  `${pad(date.getUTCFullYear())}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}%20${date.getUTCHours()}%3A${pad(0)}%3A${pad(0)}`

export const formatSeconds = (s: number): string => {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

export const formatTimer = (timer: number) => {
  const minutes = Math.floor(timer / 60)
  if (minutes < 1) return pad(timer) + 's'
  const seconds = timer % 60
  const hours = Math.floor(minutes / 60)
  if (hours < 1) return minutes + 'm' + pad(seconds) + 's'
  const days = Math.floor(hours / 24)
  if (days < 1) return hours + 'h' + pad(minutes) + 'm'
  return days + 'd' + pad(hours) + 'h'
}

export const pad = (num: number, size = 2) => {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

export const formatNumber = (num?: number): string => {
  const n = num || 0
  if (n < 1000) return n.toString()
  return Math.abs(n / 1000).toFixed(1) + 'k'
}

export const timestampToUtc = (timestamp: string): number => {
  const current = new Date().getTime()
  if (!timestamp.length) return current
  const times = timestamp.split('T')
  const date = times[0].split('-')
  if (date.length != 3) return current
  const time = times[1].split(':')
  if (time.length != 3) return current
  return Date.UTC(
    +date[0],
    +date[1] - 1,
    +date[2],
    +time[0],
    +time[1],
    +time[2],
  )
}
