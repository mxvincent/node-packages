import { Organization } from '#/database/schemas/organizations'
import { generateResource } from '@package/incubator'

export const organizationFactory = (options: { name: string }): Organization => {
	return {
		...generateResource(),
		name: options.name
	}
}
