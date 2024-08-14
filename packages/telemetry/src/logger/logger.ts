import pino from 'pino'
import { getLoggerOptions } from './options'
import { LogLevel } from './types'

export const logger = pino(getLoggerOptions())

export const setLogLevel = (level: LogLevel): void => {
  logger.level = level
  logger.debug(`[Logger] Set log level to ${level}`)
}
