import { organizationFactory } from './factories/Organization'
import { organizationMemberFactory } from './factories/OrganizationMember'
import { userFactory } from './factories/User'

/**
 * Export factories
 */
export const factories = {
	organization: organizationFactory,
	organizationMember: organizationMemberFactory,
	user: userFactory
}
