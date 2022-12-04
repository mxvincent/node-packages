import { ErrorObject } from 'ajv'

export class ValidationError extends Error {
	readonly code: string = 'ValidationError'
	readonly errors: ErrorObject[]
	readonly payload: unknown

	constructor(message: string, errors?: ValidationError['errors'], payload?: ValidationError['payload']) {
		super(message)
		this.errors = errors ?? []
		this.payload = payload
	}
}
