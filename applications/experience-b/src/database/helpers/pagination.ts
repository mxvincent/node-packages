import { ColumnMapping } from '#/database/helpers'
import { base64Decode, base64Encode, invariant } from '@mxvincent/core'
import { Page, Pagination, Sort, SortDirection } from '@mxvincent/query-params'
import { and, asc, desc, eq, gt, lt, or, SQL } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { aperture, pick, xor } from 'ramda'

export class CursorColumn<Alias = string> {
	alias: Alias
	column: PgColumn
	direction: SortDirection

	private constructor(alias: Alias, column: PgColumn, direction: SortDirection) {
		this.alias = alias
		this.column = column
		this.direction = direction
	}

	static asc<Alias extends string>(alias: Alias, column: PgColumn) {
		return new CursorColumn<Alias>(alias, column, SortDirection.ASC)
	}

	static desc<Alias extends string>(alias: Alias, column: PgColumn) {
		return new CursorColumn<Alias>(alias, column, SortDirection.DESC)
	}
}

export class PaginationManager<T extends readonly CursorColumn[]> {
	readonly columns: T

	constructor(columns: T) {
		this.columns = columns
	}

	static from<Key extends string>(sorts: Sort<Key>[], allowedColumns: ColumnMapping<Key>, primaryKey: Key[]) {
		const columns = sorts.map(({ direction, path }) => {
			return direction === SortDirection.ASC
				? CursorColumn.asc(path, allowedColumns[path])
				: CursorColumn.desc(path, allowedColumns[path])
		})
		for (const alias of primaryKey) {
			if (!columns.find((column) => column.alias === alias)) {
				columns.push(CursorColumn.asc(alias, allowedColumns[alias]))
			}
		}
		return new PaginationManager(columns)
	}

	/**
	 * Encode cursor values in a base64 string
	 */
	encodeCursor(values: Record<T[number]['alias'], unknown>): string {
		return base64Encode(
			JSON.stringify(
				pick(
					this.columns.map((column) => column.alias),
					values
				)
			)
		)
	}

	/**
	 * Decode base64 encoded cursor
	 */
	decodeCursor(cursor: string): Record<T[number]['alias'], unknown> {
		return JSON.parse(base64Decode(cursor)) as Record<T[number]['alias'], unknown>
	}

	/**
	 * Get SQL sort parameters
	 */
	sort() {
		return this.columns.map(({ column, direction }) => (direction === SortDirection.ASC ? asc(column) : desc(column)))
	}

	/**
	 * Get SQL where condition for the given cursor
	 */
	where(options: Pagination): SQL | undefined {
		if (!options.cursor) {
			return undefined
		}
		const values = this.decodeCursor(options.cursor)
		const getValue = (key: T[number]['alias']) => values[key]
		const getCondition = ({ column, direction, alias }: CursorColumn<T[number]['alias']>) => {
			return xor(options.isBackward, direction === SortDirection.DESC)
				? lt(column, getValue(alias))
				: gt(column, getValue(alias))
		}
		const conditions: SQL[] = [getCondition(invariant(this.columns[0]))]
		for (const [previous, current] of aperture(2, this.columns)) {
			const condition = and(eq(previous.column, getValue(previous.alias)), getCondition(current))
			if (condition) {
				conditions.push(condition)
			}
		}
		if (conditions.length > 1) {
			return or(...conditions)
		}
		return conditions.at(0)
	}

	createPage<TRecord extends Record<T[number]['alias'], unknown>>({
		pagination,
		records,
		totalCount
	}: {
		pagination: Pagination
		records: TRecord[]
		totalCount: number
	}): Page<TRecord> {
		const nextPageFirstItem = records.pop()
		const pageFirstItem = records.at(0)
		const pageLastItem = records.at(-1)
		return {
			data: records,
			pageInfo: {
				hasPrevPage: !!pagination.cursor,
				hasNextPage: !!nextPageFirstItem,
				startCursor: pageFirstItem ? this.encodeCursor(pageFirstItem) : null,
				endCursor: pageLastItem ? this.encodeCursor(pageLastItem) : null
			},
			totalCount
		}
	}
}
