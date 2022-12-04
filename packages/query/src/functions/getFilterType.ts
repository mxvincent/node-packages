import { comparisonOperators } from '../types/ComparisonOperator'
import { Filter } from '../types/Filter'
import { logicalOperators } from '../types/LogicalOperator'

/**
 * Return the filter operator type after verifying that it is a valid operator
 */
export const getFilterType = (operator?: string): Filter['type'] | undefined => {
	if (logicalOperators.find((value) => value === operator)) {
		return 'logical'
	}
	if (comparisonOperators.find((value) => value === operator)) {
		return 'comparison'
	}
	throw new TypeError(`Given operator is not valid (${operator}).`)
}
