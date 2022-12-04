import { Filter } from '../types/Filter'
import { isComparisonFilter } from './isComparisonFilter'
import { isLogicalFilter } from './isLogicalFilter'

/**
 * Check if value is a `FilterParams`
 */
export const isFilter = (value: unknown): value is Filter => {
	return isComparisonFilter(value) || isLogicalFilter(value)
}
