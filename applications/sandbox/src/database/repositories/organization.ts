import { Organization } from '@/database/schemas/organizations'
import { OrganizationRepositoryInterface } from '@/interfaces/organization'
import { database } from '@database/database'
import { countRows, transformFilter } from '@database/helpers'
import { PaginationManager } from '@database/helpers/pagination'
import { schema } from '@database/schema'
import { Filter, Page, Pagination, Sort } from '@mxvincent/query-params'
import { and, eq } from 'drizzle-orm'

export type OrganizationWith = NonNullable<
	Parameters<(typeof database)['query']['organization']['findMany']>[0]
>['with']

type ColumnAlias = keyof typeof OrganizationRepository.PARAMETERS

export class OrganizationRepository implements OrganizationRepositoryInterface {
	static readonly PARAMETERS = {
		id: schema.organization.id,
		name: schema.organization.name,
		createdAt: schema.organization.createdAt
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
			totalCount: await countRows(schema.organization, and(...filters))
		})
	}

	async getById(id: string): Promise<Organization | null> {
		const organization = await database.query.organization.findFirst({
			where: eq(schema.organization, id)
		})
		return organization ?? null
	}

	async create(values: Organization): Promise<Organization> {
		const [organization] = await database.insert(schema.organization).values(values).returning()
		return organization
	}
}
