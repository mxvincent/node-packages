import { organizationFactory } from '#/database/factories/organization'
import { organizationMemberFactory } from '#/database/factories/organization-member'
import { userFactory } from '#/database/factories/user'

export const factories = {
	organization: organizationFactory,
	organizationMember: organizationMemberFactory,
	user: userFactory
}
