import { User, UserUniqueProperties } from '#/database/entities/User'
import { ConflictErrorFilter } from '#/filters/errors.filter'
import { UserService } from '#/modules/user/user.service'
import { GQLDeleteResult } from '#/schemas/resource.schema'
import { GQLConnection, ListQueryParameter, Pagination, Sort } from '@mxvincent/query-params'
import { logger } from '@mxvincent/telemetry'
import { UseFilters } from '@nestjs/common'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import {
	GQLCreateUserInput,
	GQLCreateUserResult,
	GQLFindUserWhere,
	GQLListUserArgs,
	GQLUpdateUserInput,
	GQLUpdateUserResult,
	GQLUser,
	GQLUserConnection
} from './user.schema'

const isRecord = (value: unknown): value is Record<string | number | symbol, unknown> => {
	return !!value && typeof value === 'object'
}

const isUserUniqueProperty = (value: unknown): value is UserUniqueProperties => {
	return isRecord(value) && ('id' in value || 'email' in value || 'username' in value)
}

@Resolver(() => GQLUser)
@UseFilters(ConflictErrorFilter)
export class UserResolver {
	constructor(protected userService: UserService) {}

	@Query(() => GQLUserConnection, { name: 'users' })
	async listUsers(
		@Args({ type: () => GQLListUserArgs }) { first, before, after, sort }: GQLListUserArgs,
		@Info() info: GraphQLResolveInfo
	): Promise<GQLConnection<GQLUser>> {
		const options: ListQueryParameter = {
			pagination: before ? Pagination.backward(first, before) : Pagination.forward(first, after),
			sorts: [new Sort(sort.direction, sort.field)],
			filters: []
		}
		options.pagination.isCountRequested = Object.keys(graphqlFields(info)).includes('totalCount')
		return this.userService.getConnection(options)
	}

	@Query(() => GQLUser, { name: 'user', nullable: true })
	async findUser(@Args('where', { type: () => GQLFindUserWhere }) where: GQLFindUserWhere): Promise<GQLUser | null> {
		if (isUserUniqueProperty(where)) {
			return this.userService.findOne(where)
		}
		return null
	}

	@Mutation(() => GQLCreateUserResult)
	async createUser(@Args('input', { type: () => GQLCreateUserInput }) input: GQLCreateUserInput): Promise<User> {
		return await this.userService.create(input)
	}

	@Mutation(() => GQLUpdateUserResult, { nullable: true })
	async updateUser(
		@Args('where', { type: () => GQLFindUserWhere }) where: GQLFindUserWhere,
		@Args('input', { type: () => GQLUpdateUserInput }) input: GQLUpdateUserInput
	): Promise<User | null> {
		if (isUserUniqueProperty(where)) {
			return this.userService.update(where, input)
		} else {
			throw new GraphQLError(`Argument where should contains at least 1 property`)
		}
	}

	@Mutation(() => GQLDeleteResult, { nullable: true })
	async deleteUser(
		@Args('where', { type: () => GQLFindUserWhere }) where: GQLFindUserWhere
	): Promise<GQLDeleteResult | null> {
		if (isUserUniqueProperty(where)) {
			const result = await this.userService.delete(where)
			logger.warn(result)
			return result
		} else {
			throw new GraphQLError(`Argument where should contains at least 1 property`)
		}
	}
}
