import { curry } from 'ramda'
import { QueryStringValidationError } from '../errors/QueryStringValidationError'
import { QueryParameterParserOptions } from '../types/QueryParameterParserOptions'
import { QueryStringRecord } from '../types/QueryStringRecord'
import { parseFilters } from './parseFilters'
import { parsePaginationOptions } from './parsePaginationOptions'
import { parseSorts } from './parseSorts'
import { validateFilter } from './validateFilter'
import { validateSort } from './validateSort'

export const parseAndValidateQueryParameters = (qs: QueryStringRecord, options: QueryParameterParserOptions) => {
	const sorts = parseSorts(qs)
	sorts.forEach(curry(validateSort(options.sortable)))

	const filters = parseFilters(qs)
	filters.forEach(curry(validateFilter(options.filterable)))

	const { defaultSize, maxSize } = options.pagination
	const pagination = parsePaginationOptions(qs, { defaultSize })
	if (pagination?.size && pagination.size > maxSize) {
		throw new QueryStringValidationError(`Size can not be greater than ${maxSize}.`)
	}

	return { filters, sorts, pagination }
}
