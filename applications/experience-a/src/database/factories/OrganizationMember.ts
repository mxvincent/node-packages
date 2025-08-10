import { Organization } from '#/database/entities/Organization'
import {
	OrganizationMember,
	OrganizationMemberRole,
	organizationMemberRoles
} from '#/database/entities/OrganizationMember'
import { User } from '#/database/entities/User'
import { hydrate, randomArrayItem } from '@mxvincent/core'

export const organizationMemberFactory = (options: {
	organization: Organization
	user: User
	role?: OrganizationMemberRole
}): OrganizationMember => {
	return hydrate(OrganizationMember, {
		organizationId: options.organization.id,
		userId: options.user.id,
		role: options.role ?? randomArrayItem(organizationMemberRoles)
	})
}
