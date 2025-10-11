import { logger } from '@mxvincent/telemetry'
import { LoggerService } from '@nestjs/common'

const formatMessage = (message: string, [context]: string[] = []): string => {
	return context ? `[${context}] ${message}` : message
}

export class PinoLoggerAdapter implements LoggerService {
	debug(message: string, ...params: string[]): void {
		logger.debug(formatMessage(message, params))
	}

	error(message: string, ...params: string[]): void {
		logger.error(formatMessage(message, params))
	}

	log(message: string, ...params: string[]): void {
		logger.debug(formatMessage(message, params))
	}

	verbose(message: string, ...params: string[]): void {
		logger.trace(formatMessage(message, params))
	}

	warn(message: string, ...params: string[]): void {
		logger.warn(formatMessage(message, params))
	}
}
