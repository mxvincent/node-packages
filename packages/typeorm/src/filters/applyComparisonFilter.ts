import { ComparisonFilter, LogicalOperator } from '@mxvincent/query'
import { WhereExpressionBuilder } from 'typeorm'
import { generateParameterName } from '../functions/generateParameterName'
import { getComparisonString } from './comparisonStringFactories'

/**
 * Apply comparison filter on query
 * @param query - base query
 * @param filter - filter to apply
 * @param siblingRelation  - logical relation with sibling filters
 * @throws <Error> Error is thrown when comparison string factory is not registered
 */
export const applyComparisonFilter = (
	query: WhereExpressionBuilder,
	filter: ComparisonFilter,
	siblingRelation: LogicalOperator = 'and'
): WhereExpressionBuilder => {
	const parameterName = generateParameterName()
	if (siblingRelation === 'and') {
		query.andWhere(getComparisonString({ filter, parameterName }), {
			[parameterName]: filter.value
		})
	}
	if (siblingRelation === 'or') {
		query.orWhere(getComparisonString({ filter, parameterName }), { [parameterName]: filter.value })
	}
	return query
}
