import { GQLConflictError, GQLNotFoundError } from '#/schemas/errors.schema'
import { ConflictError, NotFoundError } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { ResourceNotFoundError } from '@mxvincent/typeorm'
import { Catch } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch(ConflictError)
export class ConflictErrorFilter implements GqlExceptionFilter {
	catch(error: ConflictError) {
		logger.warn(error)
		return new GQLConflictError(error.message)
	}
}

@Catch(NotFoundError)
export class NotFoundErrorFilter implements GqlExceptionFilter {
	catch(error: ResourceNotFoundError) {
		logger.warn({ stack: error.stack }, error.message)
		return new GQLNotFoundError(error.message)
	}
}
