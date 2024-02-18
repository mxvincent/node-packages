import { AuthorizationError, BaseError, ValidationError } from './base'

export class BadRequestError<T = unknown> extends ValidationError<T> {
	code = 'BadRequest'
}

export class UnauthorizedError extends AuthorizationError {
	code = 'Unauthorized'
}

export class ForbiddenError extends AuthorizationError {
	code = 'Forbidden'
}

export class NotFoundError extends BaseError {
	code = 'NotFound'
}

export class MethodNotAllowedError extends BaseError {
	code = ' MethodNotAllowed'
}

export class ConflictError extends BaseError {
	code = 'Conflict'
}

export class UnsupportedMediaTypeError extends BaseError {
	code = 'UnsupportedMediaType'
}

export class InternalServerError extends BaseError {
	code = 'InternalServer'
}

export class NotImplementedError extends BaseError {
	code = 'NotImplemented'
}

export const getHttpStatusCode = <T extends Error>(error: T): number => {
	// Client errors 4xx
	if (error instanceof BadRequestError) {
		return 400
	}
	if (error instanceof UnauthorizedError) {
		return 401
	}
	if (error instanceof ForbiddenError) {
		return 403
	}
	if (error instanceof NotFoundError) {
		return 404
	}
	if (error instanceof MethodNotAllowedError) {
		return 405
	}
	if (error instanceof ConflictError) {
		return 409
	}
	if (error instanceof UnsupportedMediaTypeError) {
		return 415
	}
	// Server errors 5xx
	if (error instanceof InternalServerError) {
		return 500
	}
	if (error instanceof NotImplementedError) {
		return 501
	}
	// Default error code will be 500
	return 500
}
