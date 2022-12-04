import { isComparisonFilter } from '../guards/isComparisonFilter'
import { isLogicalFilter } from '../guards/isLogicalFilter'
import { ComparisonFilter } from '../types/ComparisonFilter'
import { Filter } from '../types/Filter'

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
		...logicalFilters.map(({ filters, ...filter }) => ({
			...filter,
			filters: removeDuplicatedFilters(filters) as ComparisonFilter[]
		}))
	]
}
