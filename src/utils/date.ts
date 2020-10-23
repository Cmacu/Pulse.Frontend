import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import calendar from 'dayjs/plugin/calendar'

dayjs.extend(utc)
dayjs.extend(calendar)

const date = dayjs

export default date
