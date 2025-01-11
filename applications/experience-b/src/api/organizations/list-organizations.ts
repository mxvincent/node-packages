import { endpoint } from '#/core/endpoint'
import { QueryParametersSchema } from '#/core/schemas'
import { parseQueryParameters } from '#/database/helpers'
import { OrganizationRepository } from '#/database/repositories/organization'
import { Organization } from '#/database/schemas/organizations'
import { OrganizationSchema } from '#/schemas/organization'
import { Schema } from '@mxvincent/json-schema'
import { Page, Sort } from '@mxvincent/query-params'

const ListOrganizationRequestSchema = {
	querystring: QueryParametersSchema,
	response: {
		200: Schema.Page(OrganizationSchema)
	}
}

export const listOrganizations = endpoint(
	ListOrganizationRequestSchema,
	async (request): Promise<Page<Organization>> => {
		const repository = new OrganizationRepository()
		const parameters = parseQueryParameters(OrganizationRepository.PARAMETERS, request.query, {
			defaultSort: Sort.asc('createdAt'),
			defaultPaginationSize: 10
		})
		return await repository.list(parameters)
	}
)
