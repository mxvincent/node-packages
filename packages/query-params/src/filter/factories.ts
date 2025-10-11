import {
	ArrayComparisonFilter,
	ComparisonFilter,
	LogicalFilter,
	NullComparisonFilter,
	ValueComparisonFilter
} from './filters'

/**
 * Create ArrayComparisonFilter factory
 */
export function arrayComparisonFilter(operator: ArrayComparisonFilter['operator']) {
	return (path: string, values: string[]) => new ArrayComparisonFilter(operator, path, values)
}

/**
 * Create NullComparisonFilter factory
 */
export function nullComparisonFilter(operator: NullComparisonFilter['operator']) {
	return (path: string): ComparisonFilter => new NullComparisonFilter(operator, path)
}

/**
 * Create ValueComparisonFilter factory
 */
export function valueComparisonFilter(operator: ValueComparisonFilter['operator']) {
	return (path: string, value: string) => new ValueComparisonFilter(operator, path, value)
}

/**
 * Create LogicalFilter factory
 */
export function logicalFilter(operator: LogicalFilter['operator']) {
	return (filters: LogicalFilter['filters']) => new LogicalFilter(operator, filters)
}
