import { AsyncPaginationResult } from '@mxvincent/query'
import {
	markdownDescription,
	PaginationResultSchema,
	parseAndValidateQueryParameters,
	QueryParameterParserOptions,
	QueryStringRecord,
	QueryStringSchema
} from '@mxvincent/query-string'
import { CollectionPager } from '@mxvincent/typeorm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FastifySchema } from 'fastify/types/schema'
import { In } from 'typeorm'
import { database } from '../../database'
import { OrganizationMember } from '../../database/entities/OrganizationMember'
import { User } from '../../database/entities/User'
import { UserWithOrganizationsSchema } from '../../schemas/UserSchema'

const queryOptions: QueryParameterParserOptions = {
	filterable: ['createdAt', 'id', 'email', 'username'],
	sortable: ['createdAt', 'email', 'username'],
	pagination: { defaultSize: 10, maxSize: 200 }
}

const schema: FastifySchema = {
	description: markdownDescription({ header: `List users.`, query: queryOptions }),
	tags: ['User'],
	querystring: QueryStringSchema(),
	response: {
		200: PaginationResultSchema(UserWithOrganizationsSchema())
	}
}

const handler = async (request: FastifyRequest, reply: FastifyReply): AsyncPaginationResult<User> => {
	const queryParameters = parseAndValidateQueryParameters(request.query as QueryStringRecord, queryOptions)
	const query = database.createQueryBuilder(User, 'user')
	const pager = new CollectionPager(User, { query, ...queryParameters })
	const page = await pager.getPage(queryParameters.pagination)
	const organizations = await database.manager.find(OrganizationMember, {
		where: { userId: In(page.data.map((el) => el.id)) },
		relations: ['organization']
	})
	for (const user of page.data) {
		user.organizations = organizations.filter((organization) => organization.userId === user.id)
	}
	reply.setPaginationHeaders(page)
	return page
}

export default { handler, schema }
