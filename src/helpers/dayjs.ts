// dayjs-local.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' 
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/km'
import { storageService } from '@/services/storage-service'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

let currentLang = storageService.getItem("lang") || 'km'
dayjs.locale(currentLang)

const DEFAULT_TIMEZONE = 'Asia/Phnom_Penh'


const customDayjs = (...args: Parameters<typeof dayjs>) =>
  dayjs(...args).tz(DEFAULT_TIMEZONE).format()

export default customDayjs
export { dayjs }
