import { Filter, LogicalOperator } from '@mxvincent/query'
import { ObjectType, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm'
import { getAliasedPath } from '../functions/getAliasedPath'
import { applyComparisonFilter } from './applyComparisonFilter'
import { applyLogicalFilter } from './applyLogicalFilter'

/**
 * Ensure all filters are prefixed path prefixed
 */
const enforceFiltersPathAliasing = (filters: Filter[], fallbackAlias: string) => {
	for (const f of filters) {
		if (f.type === 'logical') {
			enforceFiltersPathAliasing(f.filters, fallbackAlias)
		}
		if (f.type === 'comparison' && !f.path.includes('.')) {
			f.path = getAliasedPath(f.path, fallbackAlias)
		}
	}
}

/**
 * SelectQueryBuilder type guard
 */
const isSelectQueryBuilder = (value: unknown): value is SelectQueryBuilder<ObjectType<unknown>> => {
	return typeof value === 'object' && value?.constructor?.name === 'SelectQueryBuilder'
}

/**
 * Apply many filters to a query
 * @param query - base query
 * @param filters - list of filters
 * @param siblingRelation - logical relation with sibling filters
 */
export const applyFilters = (
	query: WhereExpressionBuilder,
	filters: Filter[],
	siblingRelation: LogicalOperator = 'and'
): WhereExpressionBuilder => {
	if (isSelectQueryBuilder(query)) {
		enforceFiltersPathAliasing(filters, query.alias)
	}
	for (const filter of filters) {
		if (filter.type === 'comparison') {
			applyComparisonFilter(query, filter, siblingRelation)
		}
		if (filter.type === 'logical') {
			applyLogicalFilter(query, filter, siblingRelation)
		}
	}
	return query
}
