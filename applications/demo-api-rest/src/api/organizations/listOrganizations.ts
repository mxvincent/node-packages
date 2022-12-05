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
import { Organization } from '../../database/entities/Organization'
import { OrganizationMember } from '../../database/entities/OrganizationMember'
import { OrganizationWithMembersSchema } from '../../schemas/OrganizationSchema'

const queryOptions: QueryParameterParserOptions = {
	filterable: ['id', 'name'],
	sortable: ['createdAt'],
	pagination: { defaultSize: 2, maxSize: 200 }
}

const schema: FastifySchema = {
	description: markdownDescription({ header: `List organizations.`, query: queryOptions }),
	tags: ['Organization'],
	querystring: QueryStringSchema(),
	response: {
		200: PaginationResultSchema(OrganizationWithMembersSchema())
	}
}

const handler = async (request: FastifyRequest, reply: FastifyReply): AsyncPaginationResult<Organization> => {
	const queryParameters = parseAndValidateQueryParameters(request.query as QueryStringRecord, queryOptions)
	const query = database.createQueryBuilder(Organization, 'organization')
	const pager = new CollectionPager(Organization, { query, ...queryParameters })
	const page = await pager.getPage(queryParameters.pagination)
	const members = await database.manager.find(OrganizationMember, {
		where: { organizationId: In(page.data.map((el) => el.id)) },
		relations: ['user']
	})
	for (const organization of page.data) {
		organization.members = members.filter((organizationMember) => organizationMember.organizationId === organization.id)
	}
	reply.setPaginationHeaders(page)
	return page
}

export default { handler, schema }
