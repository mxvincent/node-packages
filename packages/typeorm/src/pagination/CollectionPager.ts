import { Filter, PaginationCursors, PaginationMetadata, Sort } from '@mxvincent/query'
import { AsyncPaginationResult } from '@mxvincent/query/dist/types/PaginationResult'
import { aperture, head, last, xor } from 'ramda'
import invariant from 'tiny-invariant'
import { Brackets, ObjectLiteral, ObjectType, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm'
import { applyFilters } from '../filters/applyFilters'
import { getAliasedPath } from '../functions/getAliasedPath'
import { CollectionSorter, CollectionSorterOptions } from '../sort/CollectionSorter'
import { TypeormPaginationOptions } from '../types/TypeormPaginationOptions'
import { base64Decode, base64Encode, CursorRelativePosition, parseCursorValue, serializeCursorValue } from './cursors'
import { getEmptyPaginationResult } from './getEmptyPaginationResult'

export type CollectionPagerOptions<T extends ObjectLiteral> = CollectionSorterOptions<T> & {
	query: SelectQueryBuilder<T>
	filters?: Filter[]
}

export class CollectionPager<T extends ObjectLiteral> extends CollectionSorter<T> {
	readonly query!: SelectQueryBuilder<T>

	/**
	 * Create collection sorter
	 */
	constructor(entity: ObjectType<T>, options: CollectionPagerOptions<T>) {
		super(entity, options)
		this.query = options.query
		if (options.filters) {
			this.applyFilters(options.filters)
		}
	}

	applyFilters(filters: Filter[]) {
		applyFilters(this.query, filters)
	}

	/**
	 * Create cursor from sort options
	 */
	encodeCursor = (entity: T): string => {
		const cursor = this.sorts
			.map((sort) => entity[sort.path])
			.map(serializeCursorValue)
			.join(',')
		return base64Encode(cursor)
	}

	/**
	 * Decode cursor and return values as record like following format
	 * {
	 *   [sortOptionsPath: string]: relatedValue as string
	 * }
	 */
	decodeCursor = (cursor: string): { [k: string]: string } => {
		const parameters = base64Decode(cursor).split(',')
		return this.sorts.reduce((output, sort, index) => {
			return Object.assign(output, { [sort.path]: parseCursorValue(parameters[index]) })
		}, {})
	}

	/**
	 * Apply sortableKeys and pagination options then query database
	 */
	async getPage(options: TypeormPaginationOptions): AsyncPaginationResult<T> {
		const isBackwardPagination = typeof options.before === 'string'
		const metadata: PaginationMetadata = {
			totalCount: await this.query.getCount(),
			hasPrevPage: false,
			hasNextPage: false
		}

		// handle empty dataset
		if (metadata.totalCount === 0) {
			return getEmptyPaginationResult()
		}

		// apply sort conditions
		this.applySorts(this.query, isBackwardPagination)

		// used to determine if a record is the first or the last of the dataset
		const hasItem = async (position: CursorRelativePosition, cursor: string): Promise<boolean> => {
			const hasItemQuery = this.query.clone()
			this.applyCursorConstraint(hasItemQuery, position, cursor)
			hasItemQuery.limit(1)
			const items = await hasItemQuery.getMany()
			return items.length >= 1
		}

		// build page query
		const pageQuery = this.query.clone()

		// apply cursor
		if (options?.after) {
			this.applyCursorConstraint(pageQuery, 'after', options.after)
		} else if (options?.before) {
			this.applyCursorConstraint(pageQuery, 'before', options.before)
		}

		// optimize data fetching with limit clause
		pageQuery.limit(options.size)

		// fetch data
		const data = await pageQuery.getMany()

		// with backward pagination sort condition are inverted that's why we need to reverse result
		// todo(mxvincent) use sql subquery around initial sort
		if (isBackwardPagination) {
			data.reverse()
		}

		// create cursors
		const cursors = await this.getPageCursors(data)

		// set metadata (hasNextPage,hasNextPage)
		metadata.hasPrevPage = cursors.startCursor ? await hasItem('before', cursors.startCursor) : false
		metadata.hasNextPage = cursors.endCursor ? await hasItem('after', cursors.endCursor) : false

		// return pagination result
		return { data, ...metadata, ...cursors }
	}

	/**
	 * Apply cursor related constraint on query builder
	 * @private
	 * for n sort parameter we need to apply many where conduction
	 *
	 * example for 4 sort params (a,b,c,d) in ascending order
	 *
	 * cursor contains this values
	 * pva = a previous value from cursor
	 * pvb = b previous value from cursor
	 * pvc = c previous value from cursor
	 * pvd = d previous value from cursor
	 *
	 * select a, b, c ,d
	 *   where a > pva
	 *   or a = pva and b > pvb
	 *   or b = pvb and c > pvc
	 *   or c = pvc and c > pvd
	 *   order by a, b, c, d
	 */
	private applyCursorConstraint(query: SelectQueryBuilder<T>, position: CursorRelativePosition, cursor: string) {
		const [firstSort] = this.sorts
		invariant(firstSort, 'Sort options must contain at least one element.')

		const whereEqual = (sort: Sort) => {
			return `${getAliasedPath(sort.path, query.alias)} = :${sort.path}`
		}
		const whereGreaterOrLower = (sort: Sort) => {
			const operator = xor(position === 'after', sort.direction === 'asc') ? '<' : '>'
			return `${getAliasedPath(sort.path, query.alias)} ${operator} :${sort.path}`
		}

		const applyNextPairContraint = (parentQueryBuilder: WhereExpressionBuilder, pair: [Sort, Sort]) => {
			return parentQueryBuilder.orWhere(
				new Brackets((qb) => {
					qb.where(whereEqual(pair[0])).andWhere(whereGreaterOrLower(pair[1]))
				})
			)
		}

		const cursorConstraint = new Brackets((qb) => {
			qb.where(whereGreaterOrLower(firstSort))
			const sortPairs: [Sort, Sort][] = aperture(2, this.sorts)
			if (sortPairs.length) {
				sortPairs.reduce(applyNextPairContraint, qb)
			}
		})
		query.andWhere(cursorConstraint)
		query.setParameters(this.decodeCursor(cursor))
	}

	/**
	 * Append page boundaries cursors
	 * @private
	 */
	private getPageCursors(records: T[]): PaginationCursors {
		const firstNode = head(records)
		const lastNode = last(records)
		return {
			startCursor: firstNode ? this.encodeCursor(firstNode) : null,
			endCursor: lastNode ? this.encodeCursor(lastNode) : null
		}
	}
}
