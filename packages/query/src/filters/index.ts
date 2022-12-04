import {
	createArrayComparisonFilter,
	createNullComparisonFilter,
	createValueComparisonFilter
} from './createComparisonFilter'
import { createLogicalFilter } from './createLogicalFilter'

/**
 * Logical filters
 */
export { createLogicalFilter }
export const And = createLogicalFilter('and')
export const Or = createLogicalFilter('or')

/**
 * Comparison filters for single values
 */
export const Equal = createValueComparisonFilter('eq')
export const NotEqual = createValueComparisonFilter('neq')
export const LessThan = createValueComparisonFilter('lt')
export const LessThanOrEqual = createValueComparisonFilter('lte')
export const GreaterThan = createValueComparisonFilter('gt')
export const GreaterThanOrEqual = createValueComparisonFilter('gte')
export const Like = createValueComparisonFilter('like')
export const NotLike = createValueComparisonFilter('nlike')
export const Regex = createValueComparisonFilter('regex')
export const Match = createValueComparisonFilter('match')
export const CaseInsensitiveMatch = createValueComparisonFilter('imatch')
export const Null = createNullComparisonFilter('null')

/**
 * Comparison filters for arrays
 */
export const In = createArrayComparisonFilter('in')
export const NotIn = createArrayComparisonFilter('nin')

/**
 * Export filter factory
 */
export { createNullComparisonFilter, createValueComparisonFilter, createArrayComparisonFilter }
