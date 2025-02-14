import {
	ComparisonFilter,
	ComparisonOperator,
	Filter,
	isArrayComparisonFilter,
	isComparisonFilter,
	isLogicalFilter,
	isNullComparisonFilter,
	isValueComparisonFilter,
	LogicalOperator,
	Pagination,
	Sort
} from '@mxvincent/query-params'
import { parse, parseSorts } from '@mxvincent/query-params-serializer'
import { PgColumn } from 'drizzle-orm/pg-core'
import * as SQLCondition from 'drizzle-orm/sql/expressions/conditions'
import { SQL } from 'drizzle-orm/sql/sql'

export type ColumnMapping<T extends string = string> = Record<T, PgColumn>

export const isAliasedSort = <Key extends string>(sort: Sort, columnAliases: ColumnMapping<Key>): sort is Sort<Key> => {
	return sort.path in columnAliases
}

export const isAliasedComparisonFilter = <Key extends string>(
	filter: Filter,
	columnAliases: ColumnMapping<Key>
): filter is ComparisonFilter<Key> => {
	return isComparisonFilter(filter) && filter.path in columnAliases
}

export const transformFilter = <Key extends string>(
	filter: Filter<Key>,
	columns: ColumnMapping<Key>
): SQL<unknown> | undefined => {
	if (isLogicalFilter(filter)) {
		switch (filter.operator) {
			case LogicalOperator.AND:
				return SQLCondition.and(...filter.filters.map((filter) => transformFilter(filter, columns)))
			case LogicalOperator.OR:
				return SQLCondition.or(...filter.filters.map((filter) => transformFilter(filter, columns)))
		}
	}
	const column = columns[filter.path]
	if (isValueComparisonFilter(filter)) {
		switch (filter.operator) {
			case ComparisonOperator.EQUAL:
				return SQLCondition.eq(column, filter.value)
			case ComparisonOperator.NOT_EQUAL:
				return SQLCondition.ne(column, filter.value)
			case ComparisonOperator.GREATER_THAN:
				return SQLCondition.gt(column, filter.value)
			case ComparisonOperator.GREATER_THAN_OR_EQUAL:
				return SQLCondition.gte(column, filter.value)
			case ComparisonOperator.LESS_THAN:
				return SQLCondition.lt(column, filter.value)
			case ComparisonOperator.LESS_THAN_OR_EQUAL:
				return SQLCondition.lte(column, filter.value)
			case ComparisonOperator.LIKE:
				return SQLCondition.like(column, filter.value)
			case ComparisonOperator.NOT_LIKE:
				return SQLCondition.notLike(column, filter.value)
		}
	}
	if (isArrayComparisonFilter(filter)) {
		switch (filter.operator) {
			case ComparisonOperator.IN:
				return SQLCondition.inArray(column, filter.values)
			case ComparisonOperator.NOT_IN:
				return SQLCondition.notInArray(column, filter.values)
		}
	}
	if (isNullComparisonFilter(filter)) {
		switch (filter.operator) {
			case ComparisonOperator.NULL:
				return SQLCondition.isNull(column)
			case ComparisonOperator.NOT_NULL:
				return SQLCondition.isNotNull(column)
		}
	}
	throw new Error('Filter is not configured')
}

export const parseQueryParameters = <Key extends string>(
	columns: ColumnMapping<Key>,
	query: {
		sorts?: string | string[]
		filters?: string | string[]
		size?: number
		after?: string
		before?: string
	},
	options: {
		defaultSort: Sort<Key>
		defaultPaginationSize: number
	}
): {
	pagination: Pagination
	filters: ComparisonFilter<Key>[]
	sorts: Sort<Key>[]
} => {
	const pagination = Pagination.forward(query.size ?? options.defaultPaginationSize, query.after)
	const filters = parse(query.filters ?? []).filter((filter) => isAliasedComparisonFilter(filter, columns))
	const sorts = query.sorts
		? parseSorts(query.sorts).filter((sort) => isAliasedSort(sort, columns))
		: [options.defaultSort]
	return { pagination, filters, sorts }
}
