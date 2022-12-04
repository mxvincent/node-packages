import { ComparisonFilter } from '../types/ComparisonFilter'
import { ComparisonOperator } from '../types/ComparisonOperator'

export const createNullComparisonFilter = (operator: ComparisonOperator) => {
	return (path: string): ComparisonFilter => {
		return { type: 'comparison', operator, path, value: null }
	}
}

export const createValueComparisonFilter = (operator: ComparisonOperator) => {
	return (path: string, value: string): ComparisonFilter => {
		return { type: 'comparison', operator, path, value }
	}
}

export const createArrayComparisonFilter = (operator: ComparisonOperator) => {
	return (path: string, value: string[]): ComparisonFilter => {
		return { type: 'comparison', operator, path, value }
	}
}
