import { NonEmptyArray } from '@mxvincent/core'
import { Sort } from '@mxvincent/query'
import { xor } from 'ramda'
import { ObjectLiteral, ObjectType, SelectQueryBuilder } from 'typeorm'
import { getAliasedPath } from '../functions/getAliasedPath'
import { getPrimaryKeyColumns } from './primaryKey'
import { enforcePrimaryKeySort, getDefaultSort } from './sortPath'

export type CollectionSorterOptions<T> = {
	sorts?: Sort[]
}

export class CollectionSorter<T extends ObjectLiteral> {
	/**
	 * Resource primary key is used to obtain a predictable sort result
	 */
	readonly primaryKey: NonEmptyArray<keyof T>

	/**
	 * Dataset sort options
	 */
	protected readonly sorts: NonEmptyArray<Sort>

	/**
	 * Create collection sorter
	 */
	constructor(protected entity: ObjectType<T>, { sorts }: CollectionSorterOptions<T>) {
		this.primaryKey = getPrimaryKeyColumns(entity)
		this.sorts = enforcePrimaryKeySort(sorts ?? getDefaultSort(entity), this.primaryKey) as NonEmptyArray<Sort>
	}

	/**
	 * Apply sortableKeys parameters then query database without pagination
	 */
	async getSortedCollection(baseQuery: SelectQueryBuilder<T>): Promise<T[]> {
		const query = baseQuery.clone()
		this.applySorts(query)
		return query.getMany()
	}

	/**
	 * Apply sortableKeys parameters
	 * @private
	 */
	protected applySorts(query: SelectQueryBuilder<T>, isBackwardPagination = false) {
		for (const sort of this.sorts) {
			query.addOrderBy(
				getAliasedPath(sort.path, query.alias),
				xor(sort.direction === 'desc', isBackwardPagination) ? 'DESC' : 'ASC'
			)
		}
	}
}
