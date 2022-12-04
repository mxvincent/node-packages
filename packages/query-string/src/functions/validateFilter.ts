import { Filter, flattenComparisonPaths, isFilter } from '@mxvincent/query'
import { curry, uniq } from 'ramda'
import { QueryStringValidationError } from '../errors/QueryStringValidationError'

/**
 * Validate `FilterParams`
 * @throws {QueryStringValidationError}
 */
export const validateFilter = curry((filterable: string[], filter: Filter) => {
	if (!isFilter(filter)) {
		throw new TypeError(`filter validator parameter should be a \`FilterParams\``)
	}
	for (const path of uniq(flattenComparisonPaths([filter]))) {
		if (!filterable.includes(path)) {
			throw new QueryStringValidationError(`filter path should be one of: ${filterable.join(', ')}`)
		}
	}
	return filter
})
