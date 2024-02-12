import { QueryParameters } from '@mxvincent/query-params'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'
import { QueryParameterParserOptions } from '../types/QueryParameterParserOptions'
import { QueryStringRecord } from '../types/QueryStringRecord'
import { parseFilters } from './parseFilters'
import { parsePaginationOptions } from './parsePagination'
import { parseSorts } from './parseSorts'
import { validateFilter } from './validateFilter'
import { validateSort } from './validateSort'

export const parseQueryParameters = (qs: QueryStringRecord, options: QueryParameterParserOptions) => {
	const sorts = parseSorts(qs)
	sorts.forEach((sort) => validateSort(options.sortable, sort))

	const filters = parseFilters(qs)
	filters.forEach((filter) => validateFilter(options.filterable, filter))

	const { defaultPageSize, maxPageSize } = options
	const pagination = parsePaginationOptions(qs, { defaultPageSize })
	pagination.isCountRequested = !!qs.totalCount

	if (pagination?.first && pagination.first > maxPageSize) {
		throw new QueryParamsValidationError(`Page size can not be greater than ${maxPageSize}.`)
	}

	return new QueryParameters({ filters, sorts, pagination })
}
