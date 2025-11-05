import { BASE64_ALPHABET, generateUUID, randomString } from '@mxvincent/core'
import { FactoryInterface } from '@package/incubator'
import { Organization } from './schemas/organization'

export class OrganizationFactory implements FactoryInterface<Organization> {
	create(values: Partial<Organization>): Organization {
		const createdAt = values.createdAt ?? new Date()
		return {
			id: values.id ?? generateUUID(7),
			createdAt,
			updatedAt: values.updatedAt ?? createdAt,
			deletedAt: values.deletedAt ?? null,
			name: values.name ?? `org-${randomString(BASE64_ALPHABET, 8)}`
		}
	}
}
