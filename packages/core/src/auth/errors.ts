export class AuthError extends Error {
	code = 'AUTH_ERROR'
	details?: Record<string, unknown>

	toJSON() {
		return {
			error: this.code,
			message: this.message,
			details: this.details
		}
	}
}

export class AuthTokenError extends AuthError {
	code = 'INVALID_TOKEN'
	details?: {
		reason?: string
		notBefore?: string
		expiredAt?: string
	}

	constructor(message: string, details?: AuthTokenError['details']) {
		super(message)
		this.details = details
	}
}

export class AuthJWKSError extends AuthError {}
