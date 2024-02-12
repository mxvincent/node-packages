import {
	ArrayComparisonFilter,
	ComparisonFilter,
	LogicalFilter,
	NullComparisonFilter,
	ValueComparisonFilter
} from '../types/Filter'

/**
 * Create ArrayComparisonFilter factory
 */
export const arrayComparisonFilter = (operator: ArrayComparisonFilter['operator']) => {
	return (path: string, values: string[]) => new ArrayComparisonFilter(operator, path, values)
}

/**
 * Create NullComparisonFilter factory
 */
export const nullComparisonFilter = (operator: NullComparisonFilter['operator']) => {
	return (path: string): ComparisonFilter => new NullComparisonFilter(operator, path)
}

/**
 * Create ValueComparisonFilter factory
 */
export const valueComparisonFilter = (operator: ValueComparisonFilter['operator']) => {
	return (path: string, value: string) => new ValueComparisonFilter(operator, path, value)
}

/**
 * Create LogicalFilter factory
 */
export const logicalFilter = (operator: LogicalFilter['operator']) => {
	return (...filters: LogicalFilter['filters']) => new LogicalFilter(operator, filters)
}

/**
 * Logical filters
 */
export const And = logicalFilter('and')
export const Or = logicalFilter('or')

/**
 * Value comparison filters
 */
export const Equal = valueComparisonFilter('equal')
export const NotEqual = valueComparisonFilter('notEqual')
export const LessThan = valueComparisonFilter('lessThan')
export const LessThanOrEqual = valueComparisonFilter('lessThanOrEqual')
export const GreaterThan = valueComparisonFilter('greaterThan')
export const GreaterThanOrEqual = valueComparisonFilter('greaterThanOrEqual')
export const Like = valueComparisonFilter('like')
export const NotLike = valueComparisonFilter('notLike')
export const Match = valueComparisonFilter('match')
export const InsensitiveMatch = valueComparisonFilter('insensitiveMatch')

/**
 * Null comparison filters
 */
export const Null = nullComparisonFilter('null')
export const NotNull = nullComparisonFilter('notNull')

/**
 * Array comparison filters
 */
export const In = arrayComparisonFilter('in')
export const NotIn = arrayComparisonFilter('notIn')
