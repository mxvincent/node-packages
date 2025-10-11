import { equals, is } from 'ramda'
import {
	ArrayComparisonFilter,
	ComparisonFilter,
	Filter,
	LogicalFilter,
	NullComparisonFilter,
	ValueComparisonFilter
} from './filters'
import {
	ARRAY_COMPARISON_OPERATORS,
	ArrayComparisonOperator,
	LOGICAL_OPERATORS,
	LogicalOperator,
	NULL_COMPARISON_OPERATORS,
	NullComparisonOperator,
	VALUE_COMPARISON_OPERATORS,
	ValueComparisonOperator
} from './operators'

/**
 * Check if value is ArrayComparisonOperator
 */
export const isArrayComparisonOperator = (value: unknown): value is ArrayComparisonOperator => {
	return is(String, value) && ARRAY_COMPARISON_OPERATORS.some(equals(value))
}

/**
 * Check if value is NullComparisonOperator
 */
export const isNullComparisonOperator = (value: unknown): value is NullComparisonOperator => {
	return is(String, value) && NULL_COMPARISON_OPERATORS.some(equals(value))
}

/**
 * Check if value is ValueComparisonOperator
 */
export const isValueComparisonOperator = (value: unknown): value is ValueComparisonOperator => {
	return is(String, value) && VALUE_COMPARISON_OPERATORS.some(equals(value))
}

/**
 * Check if value is a LogicalOperator
 */
export const isLogicalOperator = (value: unknown): value is LogicalOperator => {
	return is(String, value) && LOGICAL_OPERATORS.some(equals(value))
}

/**
 * Check if value is a ComparisonFilter
 */
export const isComparisonFilter = (value: unknown): value is ComparisonFilter => {
	return value instanceof ComparisonFilter
}

/**
 * Check if value is a LogicalFilter
 */
export const isLogicalFilter = (value: unknown): value is LogicalFilter => {
	return value instanceof LogicalFilter
}

/**
 * Check if filter is an `ArrayComparisonFilter`
 */
export const isArrayComparisonFilter = (value: unknown): value is ArrayComparisonFilter => {
	return value instanceof ArrayComparisonFilter
}

/**
 * Check if filter is a `NullComparisonFilter`
 */
export const isNullComparisonFilter = (value: unknown): value is NullComparisonFilter => {
	return value instanceof NullComparisonFilter
}

/**
 * Check if filter is a `ValueComparisonFilter`
 */
export const isValueComparisonFilter = (value: unknown): value is ValueComparisonFilter => {
	return value instanceof ValueComparisonFilter
}

/**
 * Check if value is a Filter
 */
export const isFilter = (value: unknown): value is Filter => {
	return isComparisonFilter(value) || isLogicalFilter(value)
}
