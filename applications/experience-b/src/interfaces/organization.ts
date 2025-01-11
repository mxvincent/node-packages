import { Organization } from '#/database/schemas/organizations'
import { Filter, Page, Pagination, Sort } from '@mxvincent/query-params'

export type OrganizationSort = Sort<'id' | 'createdAt' | 'name'>

export interface OrganizationRepositoryInterface {
	list(options: { pagination: Pagination; filters?: Filter[]; sorts?: OrganizationSort[] }): Promise<Page<Organization>>

	getById(id: string): Promise<Organization | null>

	create(values: Organization): Promise<Organization>
}
