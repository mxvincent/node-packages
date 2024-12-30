import { logger } from '@mxvincent/telemetry'
import { Logger } from 'typeorm'

const withPrefix = (message: string, prefix = 'Database') => `[${prefix}] ${message}`

export class PinoLoggerAdapter implements Logger {
	log(level: 'log' | 'info' | 'warn', message: string): void {
		switch (level) {
			case 'warn':
				logger.warn(withPrefix(message))
				break
			default:
				logger.trace(withPrefix(message))
		}
	}

	/**
	 * Logs query and parameters used in it.
	 */
	logQuery(query: string, parameters?: unknown[]): void {
		logger.debug({ query, parameters }, withPrefix('query completed'))
	}

	/**
	 * Logs query that is failed.
	 */
	logQueryError(error: string | Error, query: string, parameters?: unknown[]): void {
		logger.error({ query, parameters, error }, withPrefix('query failed'))
	}

	/**
	 * Logs query that is slow.
	 */
	logQuerySlow(duration: number, query: string, parameters?: unknown[]): void {
		logger.warn({ query, parameters, duration }, withPrefix('long query detected'))
	}

	/**
	 * Logs events from the migrations run process.
	 */
	logMigration(message: string): void {
		logger.info(withPrefix(message, 'DatabaseMigration'))
	}

	/**
	 * Logs events from the schema build process.
	 */
	logSchemaBuild(message: string): void {
		logger.info(withPrefix(message, 'DatabaseSchema'))
	}
}
