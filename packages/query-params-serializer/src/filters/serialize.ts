import { base64Encode } from '@mxvincent/core'
import {
	Filter,
	isArrayComparisonFilter,
	isLogicalFilter,
	isNullComparisonFilter,
	isValueComparisonFilter
} from '@mxvincent/query-params'
import { encodeFilterOperator } from './shared'

export const serializeFilter = (filter: Filter, encodeParameter = base64Encode): string => {
	if (isLogicalFilter(filter)) {
		const innerFilters = filter.filters.map((filter) => serializeFilter(filter, encodeParameter)).join(',')
		return `${encodeFilterOperator(filter.operator)}(${innerFilters})`
	}
	if (isArrayComparisonFilter(filter)) {
		return `${encodeFilterOperator(filter.operator)}(${filter.path},${filter.values.map((v) => encodeParameter(v)).join(',')})`
	}
	if (isNullComparisonFilter(filter)) {
		return `${encodeFilterOperator(filter.operator)}(${filter.path})`
	}
	if (isValueComparisonFilter(filter)) {
		return `${encodeFilterOperator(filter.operator)}(${filter.path},${encodeParameter(filter.value)})`
	}
	throw new TypeError('Invalid filter')
}

export const serializeFilters = (filters: Filter[], encode = encodeURIComponent): string[] => {
	return filters.map((filter) => serializeFilter(filter, encode))
}
