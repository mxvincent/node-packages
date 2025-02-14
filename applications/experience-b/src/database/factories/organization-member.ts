import { Organization } from '#/database/schemas/organizations'
import { User } from '#/database/schemas/users'

export const organizationMemberFactory = (options: { organization: Organization; user: User; role: string }) => {
	return {
		organizationId: options.organization.id,
		userId: options.user.id,
		role: options.role
	}
}
