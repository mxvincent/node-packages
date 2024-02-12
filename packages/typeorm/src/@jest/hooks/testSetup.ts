import { LogLevel, setLogLevel } from '@mxvincent/logger'
import process from 'process'

if (process.env.LOG_LEVEL) {
	setLogLevel(process.env.LOG_LEVEL as LogLevel)
}
