import { Filter } from '@mxvincent/query-params'

const asArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value])

export const serializeFilter = (filter: Filter, encode = encodeURIComponent): string => {
	if (filter.type === 'logical') {
		const { filters, operator } = filter
		return `${operator}(${filters.map((filter) => serializeFilter(filter, encode)).join(',')})`
	}
	const { path, operator } = filter
	const value = 'value' in filter ? filter.value : undefined
	return value ? `${operator}(${path},${asArray(value).map(encode).join(',')})` : `${operator}(${path})`
}

export const serializeFilters = (filters: Filter[], encode = encodeURIComponent): string[] => {
	return filters.map((filter) => serializeFilter(filter, encode))
}
