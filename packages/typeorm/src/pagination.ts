import { base64Decode, base64Encode, sha1 } from '@mxvincent/core'
import {
	createEmptyPage,
	GQLConnection,
	GQLEdge,
	Page,
	PageCursors,
	PageInfo,
	Pagination,
	Sort,
	SortDirection
} from '@mxvincent/query-params'
import { logger } from '@mxvincent/telemetry'
import { aperture, head, last, xor } from 'ramda'
import invariant from 'tiny-invariant'
import { Brackets, ObjectLiteral, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm'
import { CursorRelativePosition, parseCursorValue, serializeCursorValue } from './helpers/cursors'
import { getAliasedPath } from './helpers/sortPath'
import { Sorter } from './sort'

type StringTransformer = (val: string) => string
const CURSOR_SEPARATOR = ','

export class Pager<T extends ObjectLiteral> extends Sorter<T> {
	decoder: StringTransformer = base64Decode
	encoder: StringTransformer = base64Encode

	/**
	 * Decode cursor and return values as record look like following format
	 */
	decodeCursor(cursor: string): { [k: string]: string } {
		const parameters = this.decoder(cursor).split(CURSOR_SEPARATOR)
		return this.sorts.reduce((decoded, sort, index) => {
			return Object.assign(decoded, { [sort.path]: parseCursorValue(parameters[index]) })
		}, {})
	}

	/**
	 * Create a cursor from sort options
	 */
	encodeCursor(entity: T): string {
		const cursor = this.sorts
			.map((sort) => entity[sort.path])
			.map(serializeCursorValue)
			.join(CURSOR_SEPARATOR)
		return this.encoder(cursor)
	}

	/**
	 * Generate GraphEdge from a record
	 */
	generateEdge(node: T): GQLEdge<T> {
		return { cursor: this.encodeCursor(node), node }
	}

	/**
	 * Append page boundaries cursors
	 */
	getPageCursors(records: T[]): PageCursors {
		const firstNode = head(records)
		const lastNode = last(records)
		return {
			startCursor: firstNode ? this.encodeCursor(firstNode) : null,
			endCursor: lastNode ? this.encodeCursor(lastNode) : null
		}
	}

	/**
	 * Build a `Page` from given `Pagination` options
	 */
	async getPage(pagination: Pagination): Promise<Page<T>> {
		// Clone initial query
		const query = this.cloneInitialQuery()

		// Apply sorts
		this.applySorts(query, pagination.isBackward)

		// Optionally count items matching filters
		const totalCount = pagination.isCountRequested ? await query.getCount() : null

		// In case no node matches the filter, we can return an empty page
		if (pagination.isCountRequested && totalCount === 0) {
			return createEmptyPage()
		}

		// Checks for the presence of records before or after a cursor
		const hasItem = async (position: CursorRelativePosition, cursor: string): Promise<boolean> => {
			const hasItemQuery = query.clone()
			this.applyCursorConstraint(hasItemQuery, position, cursor)
			const item = await hasItemQuery.limit(1).getOne()
			return item !== null
		}

		// Get page nodes from the database
		const getPage = async () => {
			const getPageQuery = query.clone()
			if (pagination.cursor) {
				this.applyCursorConstraint(getPageQuery, pagination.isBackward ? 'before' : 'after', pagination.cursor)
			}
			getPageQuery.limit(pagination.size)
			const data = await getPageQuery.getMany()
			return pagination.isForward ? data : data.reverse()
		}

		const data = await getPage()

		// Generate page info
		const { endCursor, startCursor } = this.getPageCursors(data)
		if (startCursor) {
			logger.debug(this.decodeCursor(startCursor), `HAS ITEM BEFORE`)
		}
		const hasPrevPage = startCursor ? await hasItem('before', startCursor) : false
		if (endCursor) {
			logger.debug(this.decodeCursor(endCursor), `HAS ITEM AFTER`)
		}
		const hasNextPage = endCursor ? await hasItem('after', endCursor) : false
		const pageInfo: PageInfo = { endCursor, startCursor, hasPrevPage, hasNextPage }

		// Return pagination result
		return { data, pageInfo, totalCount }
	}

	/**
	 * Build a `GraphConnection` from given `Pagination` options
	 */
	async getConnection(pagination: Pagination): Promise<GQLConnection<T>> {
		const { data, pageInfo, totalCount } = await this.getPage(pagination)
		const edges = data.map((node) => ({ cursor: this.encodeCursor(node), node }))
		return { edges, pageInfo, totalCount }
	}

	/**
	 * Apply cursor related constraint on query builder
	 *
	 * With multiple parameters we need to apply many where conditions
	 *
	 * example for 4 sort params (a,b,c,d) in ascending order
	 *
	 * cursor contains this value
	 * pva = a previous value from cursor
	 * pvb = b previous value from cursor
	 * pvc = c previous value from cursor
	 * pvd = d previous value from cursor
	 *
	 * select a, b, c, d
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
			return `${getAliasedPath(sort.path, query.alias)} = :${sha1(sort.path)}`
		}
		const whereGreaterOrLower = (sort: Sort) => {
			const operator = xor(position === 'after', sort.direction === SortDirection.ASC) ? '<' : '>'
			return `${getAliasedPath(sort.path, query.alias)} ${operator} :${sha1(sort.path)}`
		}
		const applyNextPairConstraint = (parentQueryBuilder: WhereExpressionBuilder, sorts: [Sort, Sort]) => {
			return parentQueryBuilder.orWhere(
				new Brackets((qb) => {
					qb.where(whereEqual(sorts[0])).andWhere(whereGreaterOrLower(sorts[1]))
				})
			)
		}
		query.andWhere(
			new Brackets((qb) => {
				qb.where(whereGreaterOrLower(firstSort))
				const sortPairs: [Sort, Sort][] = aperture(2, this.sorts)
				if (sortPairs.length) {
					sortPairs.reduce(applyNextPairConstraint, qb)
				}
			})
		)
		query.setParameters(Object.fromEntries(Object.entries(this.decodeCursor(cursor)).map(([k, v]) => [sha1(k), v])))
	}
}
