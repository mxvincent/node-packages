import {
	ArrayComparisonFilter,
	Filter,
	isArrayComparisonOperator,
	isComparisonOperator,
	isLogicalOperator,
	isNullComparisonOperator,
	isValueComparisonOperator,
	LogicalFilter,
	NullComparisonFilter,
	removeDuplicatedFilters,
	ValueComparisonFilter
} from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'
import { QueryStringRecord } from '../types/QueryStringRecord'

/**
 * Filters can be nested when we use logical filters
 * We need to get all filters from the top level as string
 * For the following input: 'eq(a,a),or(eq(b,b),eq(c,c))'
 * We have two filters on top level:
 *   - Equal(a,a)
 *   - Or(Equal(b,b),Equal(c,c))
 */
export const parseLogicalFilterParameters = (input: string): string[] => {
	if (!is(String, input)) {
		throw new TypeError(`input should be a string`)
	}
	const result: string[] = []
	let depth = 0
	let start = 0
	for (let index = 0; index < input.length; index += 1) {
		if (input[index] === '(') {
			depth += 1
		} else if (input[index] === ')') {
			depth -= 1
			if (depth === 0) {
				input.slice(start, index + 1)
				result.push(input.slice(start, index + 1))
				start = index + 2
			}
		}
	}
	return result
}

/**
 * Parse filter string
 */
const parseFilter = (filterString: string, decode = decodeURIComponent): Filter => {
	const matches = filterString.match(/^((?<operator>[a-z]+)\()?(?<parameters>.*)\)$/i)

	if (!matches?.groups || !is(String, matches.groups.operator) || !is(String, matches.groups.parameters)) {
		throw new QueryParamsValidationError(`Malformed filter: ${filterString}`)
	}

	const { operator, parameters } = matches.groups

	if (isLogicalOperator(operator)) {
		const filters = parseLogicalFilterParameters(parameters).map((filter) => parseFilter(filter, decode))
		return new LogicalFilter(operator, filters)
	}
	if (isComparisonOperator(operator)) {
		const [path, ...args] = parameters.split(',')
		if (isArrayComparisonOperator(operator)) {
			return new ArrayComparisonFilter(operator, path, args.map(decode))
		}
		if (isNullComparisonOperator(operator)) {
			return new NullComparisonFilter(operator, path)
		}
		if (isValueComparisonOperator(operator)) {
			return new ValueComparisonFilter(operator, path, decode(args[0]))
		}
	}

	throw new QueryParamsValidationError(`Unrecognized filter: ${filterString}`)
}

/**
 * Extract filter params from parsed query string
 */
export const parseFilters = ({ filter }: QueryStringRecord, decode = decodeURIComponent): Filter[] => {
	if (is(String, filter)) {
		return [parseFilter(filter, decode)]
	}
	if (is(Array, filter)) {
		return removeDuplicatedFilters(filter.filter(is(String)).map((filter) => parseFilter(filter, decode)))
	}
	return []
}
