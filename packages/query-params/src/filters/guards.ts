import { equals, is, isNil } from 'ramda'
import { ComparisonFilter, Filter, LogicalFilter } from '../types/Filter'
import {
	ArrayComparisonOperator,
	arrayComparisonOperators,
	ComparisonOperator,
	comparisonOperators,
	LogicalOperator,
	logicalOperators,
	NullComparisonOperator,
	nullComparisonOperators,
	ValueComparisonOperator,
	valueComparisonOperators
} from '../types/FilterOperator'

/**
 * Check if value is a `ComparisonFilter`
 */
export const isComparisonFilter = (value: unknown): value is ComparisonFilter => {
	return !isNil(value) && is(Object, value) && (value as ComparisonFilter).type === 'comparison'
}

/**
 * Check if value is a `LogicalFilter`
 */
export const isLogicalFilter = (value: unknown): value is LogicalFilter => {
	return !isNil(value) && is(Object, value) && (value as LogicalFilter).type === 'logical'
}

/**
 * Check if value is a `FilterParams`
 */
export const isFilter = (value: unknown): value is Filter => {
	return isComparisonFilter(value) || isLogicalFilter(value)
}

/**
 * Check if value is {ArrayComparisonOperator}
 */
export const isArrayComparisonOperator = (value: unknown): value is ArrayComparisonOperator => {
	return is(String, value) && arrayComparisonOperators.some(equals(value))
}

/**
 * Check if value is {NullComparisonOperator}
 */
export const isNullComparisonOperator = (value: unknown): value is NullComparisonOperator => {
	return is(String, value) && nullComparisonOperators.some(equals(value))
}

/**
 * Check if value is {ValueComparisonOperator}
 */
export const isValueComparisonOperator = (value: unknown): value is ValueComparisonOperator => {
	return is(String, value) && valueComparisonOperators.some(equals(value))
}

/**
 * Check if value is {ComparisonOperator}
 */
export const isComparisonOperator = (value: unknown): value is ComparisonOperator => {
	return is(String, value) && comparisonOperators.some(equals(value))
}

/**
 * Check if value is {LogicalOperator}
 */
export const isLogicalOperator = (value: unknown): value is LogicalOperator => {
	return is(String, value) && logicalOperators.some(equals(value))
}
