import { isSort, Sort } from '@mxvincent/query'
import { curry } from 'ramda'
import { QueryStringValidationError } from '../errors/QueryStringValidationError'

/**
 * Validate `SortParams`
 * @throws {QueryStringValidationError}
 */
export const validateSort = curry((sortable: string[], params: Sort): Sort => {
	if (!isSort(params)) {
		throw new TypeError(`sort validator parameter should be a \`SortParams\``)
	}
	if (!sortable.includes(params.path)) {
		throw new QueryStringValidationError(`sort path should be one of: ${sortable.join(', ')}`)
	}
	return params
})
