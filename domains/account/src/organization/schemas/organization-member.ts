import { TimestampedResource } from '@package/incubator'
import { UserAccount } from '../../user-account/schemas/user-account'
import { Organization } from './organization'

export class OrganizationMember extends TimestampedResource {
	declare organization: Organization
	declare user: UserAccount
}
