export class ConfigError extends Error {
	code = 'ConfigError'

	constructor(message: string) {
		super(message)
	}
}
