import { LogicalFilter } from '../types/LogicalFilter'
import { LogicalOperator } from '../types/LogicalOperator'

export const createLogicalFilter = (operator: LogicalOperator) => {
	return (...filters: LogicalFilter['filters']): LogicalFilter => ({
		type: 'logical',
		operator,
		filters
	})
}
