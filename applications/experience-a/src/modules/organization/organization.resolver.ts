import { Organization, OrganizationUniqueProperties } from '#/database/entities/Organization'
import { OrganizationMember } from '#/database/entities/OrganizationMember'
import { ConflictErrorFilter } from '#/filters/errors.filter'
import { GQLPagination } from '#/schemas/pagination.schema'
import { GQLDeleteResult } from '#/schemas/resource.schema'
import { ComparisonFilter, GQLConnection, ListQueryParameter, Pagination, Sort } from '@mxvincent/query-params'
import { logger } from '@mxvincent/telemetry'
import { UseFilters } from '@nestjs/common'
import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from 'graphql/type'
import { GQLOrganizationMemberConnection } from './organization-member.schema'
import {
	GQLCreateOrganizationInput,
	GQLCreateOrganizationResult,
	GQLFindOrganizationWhere,
	GQLListOrganizationArgs,
	GQLOrganization,
	GQLOrganizationConnection,
	GQLUpdateOrganizationInput,
	GQLUpdateOrganizationResult
} from './organization.schema'
import { OrganizationService } from './organization.service'

const isRecord = (value: unknown): value is Record<string | number | symbol, unknown> => {
	return !!value && typeof value === 'object'
}

const isOrganizationUniqueProperty = (value: unknown): value is OrganizationUniqueProperties => {
	return isRecord(value) && ('id' in value || 'name' in value)
}

@Resolver(() => GQLOrganization)
@UseFilters(ConflictErrorFilter)
export class OrganizationResolver {
	constructor(readonly organizationService: OrganizationService) {}

	@ResolveField(() => GQLOrganizationMemberConnection)
	async members(
		@Args({ type: () => GQLPagination }) { first, before, after }: GQLPagination,
		@Parent() organization: Organization,
		@Info() info: GraphQLResolveInfo
	): Promise<GQLConnection<OrganizationMember>> {
		const options: ListQueryParameter = {
			pagination: before ? Pagination.backward(first, before) : Pagination.forward(first, after),
			sorts: [],
			filters: [ComparisonFilter.equal('organizationId', organization.id)]
		}
		options.pagination.isCountRequested = Object.keys(graphqlFields(info)).includes('totalCount')
		return this.organizationService.getMembersConnection(options)
	}

	@Query(() => GQLOrganizationConnection)
	async organizations(
		@Args({ type: () => GQLListOrganizationArgs }) { first, before, after, sort }: GQLListOrganizationArgs,
		@Info() info: GraphQLResolveInfo
	): Promise<GQLConnection<Organization>> {
		const options: ListQueryParameter = {
			pagination: before ? Pagination.backward(first, before) : Pagination.forward(first, after),
			sorts: [new Sort(sort.direction, sort.field)],
			filters: []
		}
		options.pagination.isCountRequested = Object.keys(graphqlFields(info)).includes('totalCount')
		return this.organizationService.getConnection(options)
	}

	@Query(() => GQLOrganization, { nullable: true })
	async organization(
		@Args('where', { type: () => GQLFindOrganizationWhere }) where: GQLFindOrganizationWhere
	): Promise<Organization | null> {
		if (isOrganizationUniqueProperty(where)) {
			return this.organizationService.findOne(where)
		} else {
			throw new GraphQLError(`Argument where should contains at least 1 property`)
		}
	}

	@Mutation(() => GQLCreateOrganizationResult)
	async createOrganization(
		@Args('input', { type: () => GQLCreateOrganizationInput }) input: GQLCreateOrganizationInput
	): Promise<Organization> {
		return await this.organizationService.create(input)
	}

	@Mutation(() => GQLUpdateOrganizationResult, { nullable: true })
	async updateOrganization(
		@Args('where', { type: () => GQLFindOrganizationWhere }) where: GQLFindOrganizationWhere,
		@Args('input', { type: () => GQLUpdateOrganizationInput }) input: GQLUpdateOrganizationInput
	): Promise<Organization | null> {
		if (isOrganizationUniqueProperty(where)) {
			return this.organizationService.update(where, input)
		} else {
			throw new GraphQLError(`Argument where should contains at least 1 property`)
		}
	}

	@Mutation(() => GQLDeleteResult, { nullable: true })
	async deleteOrganization(
		@Args('where', { type: () => GQLFindOrganizationWhere }) where: GQLFindOrganizationWhere
	): Promise<GQLDeleteResult | null> {
		if (isOrganizationUniqueProperty(where)) {
			const result = await this.organizationService.delete(where)
			logger.warn(result)
			return result
		} else {
			throw new GraphQLError(`Argument where should contains at least 1 property`)
		}
	}
}
