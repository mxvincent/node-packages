import { ComparisonFilter, Filter, LogicalFilter, LogicalOperator } from '@mxvincent/query-params'
import { Brackets, WhereExpressionBuilder } from 'typeorm'
import { getComparisonString } from './comparison'
import { generateParameterName } from './generateParameterName'

/**
 * Apply comparison filter on query
 */
export const applyComparisonFilter = (
	query: WhereExpressionBuilder,
	filter: ComparisonFilter,
	siblingRelation: LogicalOperator = 'and'
): WhereExpressionBuilder => {
	const parameterName = generateParameterName()
	if (siblingRelation === 'and') {
		query.andWhere(getComparisonString({ filter, parameterName }), { [parameterName]: filter.value })
	}
	if (siblingRelation === 'or') {
		query.orWhere(getComparisonString({ filter, parameterName }), { [parameterName]: filter.value })
	}
	return query
}

/**
 * Apply logical filter on query
 * Logical filter is applied in query brackets
 * @param query - base query
 * @param filter - logical filter
 * @param siblingRelation - logical relation with sibling filters
 */
export const applyLogicalFilter = (
	query: WhereExpressionBuilder,
	{ operator, filters }: LogicalFilter,
	siblingRelation: LogicalOperator = 'and'
): WhereExpressionBuilder => {
	const filter = new Brackets((qb) => {
		for (const child of filters) {
			if (child.type === 'comparison') {
				applyComparisonFilter(qb, child, operator)
			}
			if (child.type === 'logical') {
				applyLogicalFilter(qb, child, operator)
			}
		}
	})
	if (siblingRelation === 'and') {
		query.andWhere(filter)
	}
	if (siblingRelation === 'or') {
		query.orWhere(filter)
	}
	return query
}

/**
 * Apply many filters to a query
 */
export const applyFilters = (
	query: WhereExpressionBuilder,
	filters: Filter[],
	siblingRelation: LogicalOperator = 'and'
): WhereExpressionBuilder => {
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
