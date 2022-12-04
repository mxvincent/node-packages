import { Brackets, WhereExpressionBuilder } from 'typeorm'
import { LogicalFilter, LogicalOperator } from '@mxvincent/query'
import { applyComparisonFilter } from './applyComparisonFilter'

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
