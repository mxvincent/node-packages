import { ComparisonFilter } from './ComparisonFilter'
import { LogicalOperator } from './LogicalOperator'

export type AbstractLogicalFilter = {
	type: 'logical'
	operator: LogicalOperator
}

export type NestedLogicalFilter = AbstractLogicalFilter & {
	filters: ComparisonFilter[]
}

export type LogicalFilter = AbstractLogicalFilter & {
	filters: Array<NestedLogicalFilter | ComparisonFilter>
}
