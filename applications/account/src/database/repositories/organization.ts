import { database } from '#/database/client'
import { tables } from '#/database/schema'
import { ORGANIZATION_PARAMETERS } from '#/database/schemas/organizations'
import {
	CreateOrganization,
	Organization,
	OrganizationRepository,
	UpdateOrganization
} from '@domain/account'
import { stringToDate } from '@mxvincent/json-schema/dist'
import { ComparisonFilter, ListQueryParameter, Page } from '@mxvincent/query-params'

export type OrganizationWith = NonNullable<
	Parameters<(typeof database)['query']['organization']['findMany']>[0]
>['with']

type ColumnAlias = keyof typeof ORGANIZATION_PARAMETERS

export class OrganizationPostgresRepository implements OrganizationRepository {
	findOne(filters: ComparisonFilter<keyof Organization>[]): Promise<Organization | null> {
		throw new Error('Method not implemented.')
	}

	findMany(
		options: Omit<ListQueryParameter<keyof Organization>, 'pagination'>
	): Promise<Organization[]> {
		throw new Error('Method not implemented.')
	}

	async create(values: CreateOrganization): Promise<Organization> {
		const [organization] = await database.insert(tables.organization).values(values).returning()
		return {
			...organization,
			createdAt: stringToDate(organization.createdAt),
			updatedAt: stringToDate(organization.updatedAt),
			deletedAt: stringToDate(organization.deletedAt) ?? null
		}
	}

	update(entity: Organization, values: UpdateOrganization): Promise<Organization> {
		throw new Error('Method not implemented.')
	}

	delete(entity: Organization): Promise<Organization> {
		throw new Error('Method not implemented.')
	}

	getPage(parameters: ListQueryParameter<keyof Organization>): Promise<Page<Organization>> {
		throw new Error('Method not implemented.')
	}

	// async list(options: {
	// 	pagination: Pagination
	// 	sorts: Sort<ColumnAlias>[]
	// 	filters: Filter<ColumnAlias>[]
	// }): Promise<Page<Organization>> {
	// 	const pager = PaginationManager.from(options.sorts, OrganizationPostgresRepository.PARAMETERS, [
	// 		'id'
	// 	])
	// 	const filters = options.filters.map((filter) =>
	// 		transformFilter(filter, OrganizationPostgresRepository.PARAMETERS)
	// 	)
	// 	return pager.createPage({
	// 		pagination: options.pagination,
	// 		records: await database.query.organization.findMany({
	// 			limit: options.pagination.size + 1,
	// 			orderBy: pager.sort(),
	// 			with: {
	// 				members: {
	// 					with: {
	// 						user: true
	// 					}
	// 				}
	// 			},
	// 			where: and(...filters, pager.where(options.pagination))
	// 		}),
	// 		totalCount: await countRows(tables.organization, and(...filters))
	// 	})
	// }
	//
	// async getById(id: string): Promise<Organization | null> {
	// 	const organization = await database.query.organization.findFirst({
	// 		where: eq(tables.organization, id)
	// 	})
	// 	return organization ?? null
	// }

	// async create(values: Organization): Promise<Organization> {
	// 	const [organization] = await database.insert(tables.organization).values(values).returning()
	// 	return organization
	// }
}

export const organizationRepository = new OrganizationPostgresRepository()
