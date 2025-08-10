import { Field, ObjectType } from '@nestjs/graphql'
import { UUID } from './scalars.schema'

@ObjectType({ isAbstract: true })
export class GQLResource {
	@Field(() => UUID, { description: 'Resource unique identifier (UUIDv4)' })
	id!: string

	@Field(() => Date, { description: 'Resource creation date (ISO8601)' })
	createdAt!: Date

	@Field(() => Date, { description: 'Last resource update date (ISO8601)' })
	updatedAt!: Date
}

@ObjectType({ isAbstract: true })
export class GQLDeleteResult {
	@Field(() => UUID, { description: 'Resource unique identifier (UUIDv4)' })
	id!: string
}

@ObjectType({ isAbstract: true })
export class GQLSoftDeleteResult extends GQLDeleteResult {
	@Field(() => Date, { description: 'Resource delete date (ISO8601)' })
	deletedAt!: Date
}
