import { isString } from '@mxvincent/core'
import { equals } from 'ramda'
import { ValueOperator, valueOperators } from '../types/ComparisonOperator'

/**
 * Check if value is in {ValueFilterOperator} union type
 */
export const isValueOperator = (value: unknown): value is ValueOperator => {
	return isString(value) && valueOperators.some(equals(value))
}
