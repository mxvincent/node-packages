import { Repository } from '@package/incubator'
import { CreateOrganization, UpdateOrganization } from './organization.repository'
import { Organization } from './schemas/organization'

export class OrganizationService {
	repository: Repository<Organization>

	constructor(repository: Repository<Organization, CreateOrganization, UpdateOrganization>) {
		this.repository = repository
	}
}
