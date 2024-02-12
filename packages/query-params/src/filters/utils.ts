import { uniq } from 'ramda'
import { Filter } from '../types/Filter'
import { isComparisonFilter, isLogicalFilter } from './guards'

/**
 * Flatten comparison paths
 */
export const flattenComparisonPaths = (filters: Filter[]): string[] => {
	return uniq(filters.flatMap((el) => (el.type === 'comparison' ? [el.path] : flattenComparisonPaths(el.filters))))
}

/**
 * Remove duplicated entries from filter params list
 * @param filters
 */
export const removeDuplicatedFilters = (filters: Filter[]): Filter[] => {
	const logicalFilters = filters.filter(isLogicalFilter)
	const comparisonFilters = filters.filter(isComparisonFilter)
	return [
		...comparisonFilters.filter(
			(filter, index) => comparisonFilters.findIndex(({ path }) => filter.path === path) === index
		),
		...logicalFilters.map((filter) => Object.assign(filter, { filters: removeDuplicatedFilters(filter.filters) }))
	]
}
