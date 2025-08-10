import { Organization } from '#/database/entities/Organization'
import { faker } from '@faker-js/faker'
import { deletableResourceFactory, hydrate } from '@mxvincent/typeorm'

export const organizationFactory = (options: Partial<Organization> = {}): Organization => {
	return hydrate(Organization, {
		...deletableResourceFactory(options),
		name: options.name ?? faker.company.name()
	})
}
