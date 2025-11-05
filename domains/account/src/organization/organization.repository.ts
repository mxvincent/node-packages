import { KeyOf, ResourceNotFoundError } from '@mxvincent/core'
import {
	ComparisonFilter,
	createEmptyPage,
	ListQueryParameter,
	Page
} from '@mxvincent/query-params'
import { filterArrayWith, Repository, RepositoryGetPage, sortArrayWith } from '@package/incubator'
import { OrganizationFactory } from './organization.factory'
import { Organization } from './schemas/organization'

const organizations = new Map<string, Organization>()
const organizationFactory = new OrganizationFactory()

export interface CreateOrganization {
	name: string
}

export interface UpdateOrganization {
	name: string
}

export type OrganizationRepository = Repository<
	Organization,
	CreateOrganization,
	UpdateOrganization
> &
	RepositoryGetPage<Organization>

export class OrganizationMemoryRepository implements OrganizationRepository {
	getPage({ filters, sorts }: ListQueryParameter<keyof Organization>): Promise<Page<Organization>> {
		const filtered = filterArrayWith(filters, [...organizations.values()])
		const sorted = sortArrayWith(sorts, filtered)
		const page = createEmptyPage() as Page<Organization>
		page.data = sorted
		return Promise.resolve(page)
	}

	findMany({
		filters,
		sorts
	}: Omit<ListQueryParameter<KeyOf<Organization>>, 'pagination'>): Promise<Organization[]> {
		const filtered = filterArrayWith(filters, [...organizations.values()])
		const sorted = sortArrayWith(sorts, filtered)
		return Promise.resolve(sorted)
	}

	create(values: CreateOrganization): Promise<Organization> {
		const record = organizationFactory.create(values)
		organizations.set(record.id, record)
		return Promise.resolve(record)
	}

	update(record: Organization, values: UpdateOrganization): Promise<Organization> {
		const organization = organizations.get(record.id)
		if (!organization) {
			throw new ResourceNotFoundError('organization', record.id)
		}
		Object.assign(organization, values)
		return Promise.resolve(organization)
	}

	delete(record: Organization): Promise<Organization> {
		const organization = organizations.get(record.id)
		if (!organization) {
			throw new ResourceNotFoundError('organization', record.id)
		}
		organizations.delete(record.id)
		return Promise.resolve(organization)
	}

	findOne(filters: ComparisonFilter<keyof Organization>[]): Promise<Organization | null> {
		const items = filterArrayWith(filters, [...organizations.values()])
		return Promise.resolve(items.at(0) ?? null)
	}

	getById(organizationId: string): Promise<Organization | null> {
		return Promise.resolve(organizations.get(organizationId) ?? null)
	}
}
