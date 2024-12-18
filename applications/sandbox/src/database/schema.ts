import { user, userRelations } from '@/database/schemas/users'
import { organization, organizationRelations } from '@/database/schemas/organizations'
import { organizationMember, organizationMemberRelations } from '@/database/schemas/organization-members'

export const schema = {
	organization,
	organizationMember,
	user
}

export const schemaRelations = {
	organizationRelations,
	organizationMemberRelations,
	userRelations
}
