import pino from 'pino'
import { getLoggerOptions } from './options'
import { LogLevel } from './types'

export const logger = pino(getLoggerOptions())

export const setLogLevel = (level: LogLevel): void => {
	logger.level = level
}
