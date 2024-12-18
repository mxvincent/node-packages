import { AuthorizationError, BaseError } from './base'
import { ValidationError } from './validation'

export class BadRequestError<T = unknown> extends ValidationError<T> {
	code = 'BAD_REQUEST'
}

export class UnauthorizedError extends AuthorizationError {
	code = 'UNAUTHORIZED'
}

export class ForbiddenError extends AuthorizationError {
	code = 'FORBIDDEN'
}

export class NotFoundError extends BaseError {
	code = 'NOT_FOUND'
}

export class MethodNotAllowedError extends BaseError {
	code = 'METHOD_NOT_ALLOWED'
}

export class ConflictError extends BaseError {
	code = 'CONFLICT'
}

export class UnsupportedMediaTypeError extends BaseError {
	code = 'UNSUPPORTED_MEDIA_TYPE'
}

export class UnprocessableEntityError extends BaseError {
	code = 'UNPROCESSABLE_ENTITY'
}

export class InternalServerError extends BaseError {
	code = 'INTERNAL_SERVER_ERROR'
}

export class NotImplementedError extends BaseError {
	code = 'NOT_IMPLEMENTED'
}

export const getHttpStatusCode = <T extends Error>(error: T): number => {
	if (error instanceof ValidationError) {
		return 400
	}
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
	if (error instanceof UnprocessableEntityError) {
		return 422
	}
	if (error instanceof InternalServerError) {
		return 500
	}
	if (error instanceof NotImplementedError) {
		return 501
	}
	return 500
}
