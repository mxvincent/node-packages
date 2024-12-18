import * as process from 'node:process'
import { LoggerOptions } from 'pino'
import { isTelemetryEnabled } from '../config/values'
import { isPinoLogLevel, LogLevel } from './types'

/**
 * Add OpenTelemetry trace context attributes to the pino log record
 */
interface LogRecord {
	trace_id?: string
	span_id?: string
	trace_flags?: string
	[key: string]: unknown
}

/**
 * Bind pino log levels to gcp log severity levels
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
 * https://getpino.io/#/docs/help?id=mapping-pino-log-levels-to-google-cloud-logging-stackdriver-severity-levels
 */
const PinoLogLevelToGCPLogSeverity: Record<string, string | undefined> = {
	trace: 'DEBUG',
	debug: 'DEBUG',
	info: 'INFO',
	warn: 'WARNING',
	error: 'ERROR',
	fatal: 'CRITICAL'
}

/**
 * Get application logger log level
 */
export const getDefaultLogLevel = (): LogLevel => {
	const configuredLogLevel = process.env['APP_LOG_LEVEL']
	if (configuredLogLevel) {
		return isPinoLogLevel(configuredLogLevel) ? configuredLogLevel : LogLevel.INFO
	}
	switch (process.env.NODE_ENV) {
		case 'production':
			return LogLevel.INFO
		case 'test':
			return LogLevel.SILENT
		default:
			return LogLevel.TRACE
	}
}

/**
 * Generate logger options
 */
export const getLoggerOptions = (): LoggerOptions => {
	const options: LoggerOptions = {
		level: getDefaultLogLevel(),
		// Use `message` key instead of `msg`
		messageKey: 'message',
		// Same as `pino.stdTimeFunctions.isoTime` but uses `timestamp` key instead of `time`
		timestamp(): string {
			return `,"timestamp":"${new Date(Date.now()).toISOString()}"`
		},
		redact: {
			paths: ['[*].headers.authorization']
		}
	}

	if (isTelemetryEnabled) {
		options.formatters = {
			log(object: LogRecord): Record<string, unknown> {
				// Add trace context attributes following Cloud Logging structured log format
				// https://cloud.google.com/logging/docs/structured-logging#special-payload-fields
				const { trace_id, span_id, trace_flags, ...rest } = object
				return {
					'logging.googleapis.com/trace': trace_id,
					'logging.googleapis.com/spanId': span_id,
					'logging.googleapis.com/trace_sampled': trace_flags ? trace_flags === '01' : undefined,
					...rest
				}
			},
			level(label: string) {
				return {
					severity: PinoLogLevelToGCPLogSeverity[label] ?? PinoLogLevelToGCPLogSeverity['info']
				}
			}
		}
	}

	// Enable pino-pretty for non production environments
	if (!process.env.NODE_ENV) {
		options.transport = {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname'
			}
		}
	}

	return options
}
