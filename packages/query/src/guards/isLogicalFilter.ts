import { is, isNil } from 'ramda'
import { LogicalFilter } from '../types/LogicalFilter'

/**
 * Check if value is a `LogicalFilter`
 */
export const isLogicalFilter = (value: unknown): value is LogicalFilter => {
	return !isNil(value) && is(Object, value) && (value as LogicalFilter).type === 'logical'
}
