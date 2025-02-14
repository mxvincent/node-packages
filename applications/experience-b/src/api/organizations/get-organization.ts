import { endpoint } from '#/core/endpoint'
import { OrganizationRepository } from '#/database/repositories/organization'
import { ResourceNotFoundError } from '#/errors/resource'
import { OrganizationSchema } from '#/schemas/organization'
import { Type } from '@mxvincent/json-schema'

const schema = {
	params: Type.Object({ id: Type.String({ format: 'uuid' }) }),
	response: {
		200: OrganizationSchema
	}
}

export const getOrganization = endpoint(schema, async (request) => {
	const organizationRepository = new OrganizationRepository()
	const organization = await organizationRepository.getById(request.params.id)
	if (!organization) {
		throw new ResourceNotFoundError('Organization', request.params.id)
	}
	return organization
})
