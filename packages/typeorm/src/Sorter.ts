import { Filter, isLogicalFilter, Sort, SortDirection } from '@mxvincent/query-params'
import { NonEmptyArray } from '@mxvincent/utils'
import { clone, xor } from 'ramda'
import { ObjectLiteral, ObjectType, SelectQueryBuilder } from 'typeorm'
import { applyFilters } from './filters/applyFilters'
import { getPrimaryKeyColumns } from './helpers/primaryKey'
import { getAliasedPath, getDefaultSort, mergePrimaryKeySorts } from './helpers/sortPath'

export const enforceFilterPathAliasing = (filters: Filter[], alias: string): Filter[] => {
	return filters.map((filter) => {
		if (isLogicalFilter(filter)) {
			return Object.assign(Object.create(filter), { filters: enforceFilterPathAliasing(filter.filters, alias) })
		}
		if (filter.path.includes('.')) {
			return filter
		}
		return Object.assign(Object.create(filter), { path: `${alias}.${filter.path}` })
	})
}

export type CollectionSorterOptions<T extends ObjectLiteral> = {
	filters?: Filter[]
	sorts?: Sort[]
	query: SelectQueryBuilder<T>
}

const query = Symbol('CollectionSorter.query')

export class Sorter<T extends ObjectLiteral> {
	/**
	 * User provided query
	 */
	readonly [query]: SelectQueryBuilder<T>

	/**
	 * Resource primary key is used to obtain a predictable sort result
	 */
	readonly primaryKeyColumns: NonEmptyArray<string>

	/**
	 * Collection sort options
	 */
	protected readonly sorts: NonEmptyArray<Sort>

	/**
	 * Create collection sorter
	 */
	constructor(protected entity: ObjectType<T>, options: CollectionSorterOptions<T>) {
		this.primaryKeyColumns = getPrimaryKeyColumns(entity)
		this[query] = options.query
		if (options.filters) {
			const filters = enforceFilterPathAliasing(options.filters, options.query.alias)
			applyFilters(this[query], filters, 'and')
		}
		this.sorts = mergePrimaryKeySorts(options.sorts ?? getDefaultSort(entity), this.primaryKeyColumns)
	}

	/**
	 * We need to clone provided query
	 * Base query should only be filtered and parametrized
	 */
	cloneInitialQuery() {
		return clone(this[query])
	}

	/**
	 * Apply sorts to the given query builder instance
	 * SQLite null values are considered bigger than non-null values like PostgreSQL
	 * We can invert sort order with second parameter to allow backward pagination
	 */
	protected applySorts(query: SelectQueryBuilder<T>, isBackwardPagination = false) {
		for (const sort of this.sorts) {
			query.addOrderBy(
				getAliasedPath(sort.path, query.alias),
				xor(sort.direction === SortDirection.descending, isBackwardPagination) ? 'DESC' : 'ASC',
				xor(sort.direction === SortDirection.descending, isBackwardPagination) ? 'NULLS FIRST' : 'NULLS LAST'
			)
		}
	}

	/**
	 * Apply sortableKeys parameters then query database without pagination
	 */
	async getSortedCollection(): Promise<T[]> {
		const query = this.cloneInitialQuery()
		this.applySorts(query)
		return query.getMany()
	}
}
