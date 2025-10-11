import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export abstract class GQLError {
	@Field(() => String, { description: 'Error code.' })
	abstract readonly code: string

	@Field(() => String, { description: 'Error message.' })
	readonly message: string

	constructor(message: string) {
		this.message = message
	}
}

@ObjectType('ConflictError')
export class GQLConflictError extends GQLError {
	code = 'Conflict'
}

@ObjectType('NotFoundError')
export class GQLNotFoundError extends GQLError {
	code = 'ResourceNotFound'
}

export const isGraphqlError = (error: unknown): error is GQLError => {
	return error instanceof GQLError
}
