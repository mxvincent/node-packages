import { context } from '#/core/context'
import { Organization } from '#/database/entities/Organization'

export function listOrganizations() {
	return context.database.manager.find(Organization)
}
