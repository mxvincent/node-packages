import { ConfigError } from './ConfigError'

export class ConfigValidationError extends ConfigError {
	code = 'ConfigValidationError'

	errors?: unknown[] = []

	constructor(message?: string, errors?: unknown[]) {
		super(message ?? `Config validation failed.`)
		this.errors = errors
	}
}
