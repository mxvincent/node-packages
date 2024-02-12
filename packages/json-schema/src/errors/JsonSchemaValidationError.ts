import { ErrorObject } from 'ajv'

export class JsonSchemaValidationError extends Error {
	readonly code: string = 'ValidationError'
	readonly errors: ErrorObject[] = []
	readonly context?: string
	readonly payload?: unknown

	constructor(
		message: string,
		options?: {
			errors?: JsonSchemaValidationError['errors']
			context?: string
			payload?: unknown
		}
	) {
		super(message)
		if (options) {
			Object.assign<JsonSchemaValidationError, Partial<JsonSchemaValidationError>>(this, options)
		}
	}
}
