import { is, isNil } from 'ramda'
import { ComparisonFilter } from '../types/ComparisonFilter'

/**
 * Check if value is a `ComparisonFilter`
 */
export const isComparisonFilter = (value: unknown): value is ComparisonFilter => {
	return !isNil(value) && is(Object, value) && (value as ComparisonFilter).type === 'comparison'
}
