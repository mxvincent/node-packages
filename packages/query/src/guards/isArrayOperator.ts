import { isString } from '@mxvincent/core'
import { equals } from 'ramda'
import { ArrayOperator, arrayOperators } from '../types/ComparisonOperator'

/**
 * Check if value is in {ArrayFilterOperator} union type
 */

export const isArrayOperator = (value: unknown): value is ArrayOperator => {
	return isString(value) && arrayOperators.some(equals(value))
}
