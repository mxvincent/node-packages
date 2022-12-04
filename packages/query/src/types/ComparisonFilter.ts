import { ComparisonOperator } from './ComparisonOperator'

export type ComparisonFilter = {
	type: 'comparison'
	operator: ComparisonOperator
	path: string
	value: string | string[] | null
}
