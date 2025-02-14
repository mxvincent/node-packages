import { database } from '#/database/client'
import { countRows, transformFilter } from '#/database/helpers'
import { PaginationManager } from '#/database/helpers/pagination'
import { tables } from '#/database/schema'
import { Organization } from '#/database/schemas/organizations'
import { OrganizationRepositoryInterface } from '#/interfaces/organization'
import { Filter, Page, Pagination, Sort } from '@mxvincent/query-params'
import { and, eq } from 'drizzle-orm'

export type OrganizationWith = NonNullable<
	Parameters<(typeof database)['query']['organization']['findMany']>[0]
>['with']

type ColumnAlias = keyof typeof OrganizationRepository.PARAMETERS

export class OrganizationRepository implements OrganizationRepositoryInterface {
	static readonly PARAMETERS = {
		id: tables.organization.id,
		name: tables.organization.name,
		createdAt: tables.organization.createdAt
	}

	async list(options: {
		pagination: Pagination
		sorts: Sort<ColumnAlias>[]
		filters: Filter<ColumnAlias>[]
	}): Promise<Page<Organization>> {
		const pager = PaginationManager.from(options.sorts, OrganizationRepository.PARAMETERS, ['id'])
		const filters = options.filters.map((filter) => transformFilter(filter, OrganizationRepository.PARAMETERS))
		return pager.createPage({
			pagination: options.pagination,
			records: await database.query.organization.findMany({
				limit: options.pagination.size + 1,
				orderBy: pager.sort(),
				with: {
					members: {
						with: {
							user: true
						}
					}
				},
				where: and(...filters, pager.where(options.pagination))
			}),
			totalCount: await countRows(tables.organization, and(...filters))
		})
	}

	async getById(id: string): Promise<Organization | null> {
		const organization = await database.query.organization.findFirst({
			where: eq(tables.organization, id)
		})
		return organization ?? null
	}

	async create(values: Organization): Promise<Organization> {
		const [organization] = await database.insert(tables.organization).values(values).returning()
		return organization
	}
}
