import { uniq } from 'ramda'
import { Filter } from '../types/Filter'

/**
 * Flatten comparison paths
 */
export const flattenComparisonPaths = (filters: Filter[]): string[] => {
	return uniq(filters.flatMap((el) => (el.type === 'comparison' ? [el.path] : flattenComparisonPaths(el.filters))))
}
