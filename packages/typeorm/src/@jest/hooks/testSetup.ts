import { LogLevel, setLogLevel } from '@mxvincent/telemetry'
import process from 'process'

if (process.env.LOG_LEVEL) {
	setLogLevel(process.env.LOG_LEVEL as LogLevel)
}
