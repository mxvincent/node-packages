import { Filter, flattenComparisonPaths, isFilter } from '@mxvincent/query-params'
import { uniq } from 'ramda'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'

/**
 * Validate `FilterParams`
 * @throws {QueryParamsValidationError}
 */
export const validateFilter = (filterable: string[], filter: Filter) => {
	if (!isFilter(filter)) {
		throw new TypeError(`Filter validator parameter should be a \`FilterParams\``)
	}
	for (const path of uniq(flattenComparisonPaths([filter]))) {
		if (!filterable.includes(path)) {
			throw new QueryParamsValidationError(`Filter path should be one of: ${filterable.join(' ')}`)
		}
	}
	return filter
}
