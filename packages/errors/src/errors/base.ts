export abstract class BaseError extends Error {
	abstract readonly code: string

	toString() {
		return `[${this.code}] ${this.message}`
	}

	toJSON() {
		return {
			message: this.message,
			code: this.code,
			stack: this.stack
		}
	}
}

export class ValidationError<ErrorType> extends BaseError {
	code = 'ValidationError'
	errors!: ErrorType[]

	protected constructor(message: string, errors: ErrorType[]) {
		super(message)
		this.errors = errors
	}
}

export abstract class AuthorizationError extends BaseError {}
