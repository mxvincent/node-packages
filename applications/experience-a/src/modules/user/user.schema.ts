import { GQLConflictError } from '@app/schemas/errors.schema'
import { createConnectionType, GQLPagination } from '@app/schemas/pagination.schema'
import { GQLResource } from '@app/schemas/resource.schema'
import { UUID } from '@app/schemas/scalars.schema'
import { GQLSort } from '@app/schemas/sort.schema'
import { User } from '@database/entities/User'
import { SortDirection } from '@mxvincent/query-params'
import { ArgsType, createUnionType, Field, InputType, ObjectType, PartialType, registerEnumType } from '@nestjs/graphql'

@ObjectType('User')
export class GQLUser extends GQLResource {
	@Field(() => String)
	email!: string

	@Field(() => String)
	firstName!: string

	@Field(() => String)
	lastName!: string

	@Field(() => String)
	username!: string
}

export const GQLUserConnection = createConnectionType(GQLUser, 'User')

@InputType('FindUserWhere')
export class GQLFindUserWhere {
	@Field(() => UUID, { nullable: true })
	id?: string

	@Field(() => String, { nullable: true })
	email?: string

	@Field(() => String, { nullable: true })
	username?: string
}

@InputType('CreateUserInput')
export class GQLCreateUserInput {
	@Field(() => String)
	email!: string

	@Field(() => String)
	username!: string

	@Field(() => String)
	firstName!: string

	@Field(() => String)
	lastName!: string
}

@InputType('UpdateUserInput')
export class GQLUpdateUserInput extends PartialType(GQLCreateUserInput) {}

export const GQLCreateUserResult = createUnionType({
	name: 'CreateUserResult',
	types: () => [GQLUser, GQLConflictError] as const,
	resolveType(value) {
		if (value instanceof User) {
			return GQLUser
		}
		return value.constructor
	}
})

export const GQLUpdateUserResult = createUnionType({
	name: 'UpdateUserResult',
	types: () => [GQLUser, GQLConflictError] as const,
	resolveType(value) {
		if (value instanceof User) {
			return GQLUser
		}
		return value.constructor
	}
})

export enum GQLUserSortField {
	id = 'id',
	createdAt = 'createdAt'
}

registerEnumType(GQLUserSortField, { name: 'UserSortField' })

@InputType('UserSort')
export class GQLUserSort implements GQLSort {
	@Field(() => SortDirection)
	direction!: SortDirection

	@Field(() => GQLUserSortField)
	field!: GQLUserSortField
}

@ArgsType()
export class GQLListUserArgs extends GQLPagination {
	@Field(() => GQLUserSort, { defaultValue: { direction: SortDirection.DESC, field: GQLUserSortField.id } })
	sort!: GQLUserSort
}
