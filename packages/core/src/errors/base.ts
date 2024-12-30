export abstract class BaseError extends Error {
	abstract readonly code: string

	toString() {
		return `[${this.code}] ${this.message}`
	}

	toJSON() {
		return {
			message: this.message,
			code: this.code
		}
	}
}

export abstract class AuthorizationError extends BaseError {}
