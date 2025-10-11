import { generateResource } from '#/database/helpers/factories'
import { Organization } from '#/database/schemas/organizations'

export const organizationFactory = (options: { name: string }): Organization => {
	return {
		...generateResource(),
		name: options.name
	}
}
