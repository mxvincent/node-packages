import { isSort, Sort } from '@mxvincent/query-params'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'

/**
 * Validate `SortParams`
 * @throws {QueryParamsValidationError}
 */
export const validateSort = (sortable: string[], params: Sort): Sort => {
	if (!isSort(params)) {
		throw new TypeError(`Sort validator parameter should be a \`SortParams\``)
	}
	if (!sortable.includes(params.path)) {
		throw new QueryParamsValidationError(`Sort path should be one of: ${sortable.join(', ')}`)
	}
	return params
}
