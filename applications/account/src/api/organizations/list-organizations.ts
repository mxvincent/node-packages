import { parseQueryParameters } from '#/database/helpers/query-params'
import { organizationRepository } from '#/database/repositories/organization'
import { ORGANIZATION_PARAMETERS } from '#/database/schemas/organizations'
import { OrganizationSchema } from '#/schemas/organization'
import { QueryParametersSchema } from '#/schemas/query-parameters'
import { Organization } from '@domain/account'
import { Schema } from '@mxvincent/json-schema'
import { Page, Sort } from '@mxvincent/query-params'
import { endpoint } from '@package/incubator'
import { FastifySchema } from 'fastify'

const ListOrganizationRequestSchema = {
	querystring: QueryParametersSchema,
	response: {
		200: Schema.Page(OrganizationSchema)
	}
} satisfies FastifySchema

export const listOrganizations = endpoint(
	ListOrganizationRequestSchema,
	async (request): Promise<Page<Organization>> => {
		const parameters = parseQueryParameters(ORGANIZATION_PARAMETERS, request.query, {
			defaultSort: Sort.asc('createdAt'),
			defaultPaginationSize: 10
		})
		return await organizationRepository.getPage(parameters)
	}
)
