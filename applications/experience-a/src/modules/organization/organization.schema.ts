import { Organization } from '#/database/entities/Organization'
import { GQLConflictError } from '#/schemas/errors.schema'
import { createConnectionType, GQLPagination } from '#/schemas/pagination.schema'
import { GQLResource } from '#/schemas/resource.schema'
import { UUID } from '#/schemas/scalars.schema'
import { GQLSort } from '#/schemas/sort.schema'
import { SortDirection } from '@mxvincent/query-params'
import { ArgsType, createUnionType, Field, InputType, ObjectType, PartialType, registerEnumType } from '@nestjs/graphql'
import { GQLOrganizationMemberConnection } from './organization-member.schema'

@ObjectType('Organization')
export class GQLOrganization extends GQLResource {
	@Field(() => String)
	name!: string

	@Field(() => GQLOrganizationMemberConnection)
	members!: typeof GQLOrganizationMemberConnection
}

export const GQLOrganizationConnection = createConnectionType(GQLOrganization, 'Organization')

export enum OrganizationSortField {
	id = 'id',
	createdAt = 'createdAt'
}

registerEnumType(OrganizationSortField, { name: 'OrganizationSortField' })

@InputType('OrganizationSort')
export class GQLOrganizationSort implements GQLSort {
	@Field(() => SortDirection)
	direction!: SortDirection

	@Field(() => OrganizationSortField)
	field!: OrganizationSortField
}

@ArgsType()
export class GQLListOrganizationArgs extends GQLPagination {
	@Field(() => GQLOrganizationSort, {
		defaultValue: { direction: SortDirection.ASC, field: OrganizationSortField.id }
	})
	sort!: GQLOrganizationSort
}

@InputType('FindOrganizationWhere', { isAbstract: true })
export class GQLFindOrganizationWhere {
	@Field(() => UUID, { nullable: true })
	id?: string

	@Field(() => String, { nullable: true })
	name?: string
}

@InputType('CreateOrganizationInput')
export class GQLCreateOrganizationInput {
	@Field(() => String)
	name!: string
}

export const GQLCreateOrganizationResult = createUnionType({
	name: 'CreateOrganizationResult',
	types: () => [GQLOrganization, GQLConflictError] as const,
	resolveType(value) {
		if (value instanceof Organization) {
			return GQLOrganization
		}
		return value.constructor
	}
})

export const GQLUpdateOrganizationResult = createUnionType({
	name: 'UpdateOrganizationResult',
	types: () => [GQLOrganization, GQLConflictError] as const,
	resolveType(value) {
		if (value instanceof Organization) {
			return GQLOrganization
		}
		return value.constructor
	}
})

@InputType('UpdateOrganizationInput')
export class GQLUpdateOrganizationInput extends PartialType(GQLCreateOrganizationInput) {}
