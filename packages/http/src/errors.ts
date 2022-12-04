import { ErrorObject } from '@mxvincent/json-schema'

export abstract class HttpError extends Error {
	abstract code: string
	abstract statusCode: number
}

export class BadRequestError extends HttpError {
	code = 'BadRequestError'
	readonly statusCode = 400
	errors!: ErrorObject[]

	static withErrors(errors: ErrorObject[], target?: string): BadRequestError {
		const instance = new BadRequestError('Request validation failed' + (target ? ` (${target}).` : '.'))
		instance.errors = errors
		return instance
	}

	constructor(message = 'Request validation failed.') {
		super(message)
	}
}

export class UnauthorizedError extends HttpError {
	code = 'UnauthorizedError'
	readonly statusCode = 401
}

export class ForbiddenError extends HttpError {
	code = 'ForbiddenError'
	readonly statusCode = 403
}

export class NotFoundError extends HttpError {
	code = 'NotFoundError'
	readonly statusCode = 404
}

export class MethodNotAllowedError extends HttpError {
	code = 'MethodNotAllowedError'
	readonly statusCode = 405
}

export class ConflictError extends HttpError {
	code = 'MethodNotAllowedError'
	readonly statusCode = 409
}

export class UnsupportedMediaTypeError extends HttpError {
	code = 'UnsupportedMediaTypeError'
	readonly statusCode = 415
}

export class InternalServerError extends HttpError {
	code = 'InternalServerError'
	readonly statusCode = 500
}

export class NotImplementedError extends HttpError {
	code = 'NotImplementedError'
	readonly statusCode = 501
}
