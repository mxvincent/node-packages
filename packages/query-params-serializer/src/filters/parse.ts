import { base64Decode } from '@mxvincent/core'
import {
	ArrayComparisonFilter,
	ComparisonFilter,
	Filter,
	isArrayComparisonOperator,
	isLogicalOperator,
	isNullComparisonOperator,
	isValueComparisonOperator,
	LogicalFilter,
	NullComparisonFilter,
	ValueComparisonFilter
} from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryStringParameterValidationError } from '../shared/errors'
import { decodeFilterOperator } from './shared'

/**
 * Filters can be nested when we use logical filters
 * We need to get all filters from the top level as string
 * For the following input: 'eq(a,a),or(eq(b,b),eq(c,c))'
 * We have two filters on top level:
 *   - Filter.equal(a,a)
 *   - Or(Filter.equal(b,b),Filter.equal(c,c))
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
const parseFilter = (filterString: string, decode = base64Decode): ComparisonFilter | LogicalFilter => {
	const matches = filterString.match(/^((?<operator>[a-z]+)\()?(?<parameters>.*)\)$/i)

	if (!matches?.groups) {
		throw new QueryStringParameterValidationError(`Malformed filter`, [filterString])
	}

	const operator = decodeFilterOperator(matches.groups.operator)
	if (!operator) {
		throw new QueryStringParameterValidationError(`Operator is not supported`, [filterString])
	}

	const { parameters } = matches.groups
	if (!parameters) {
		throw new QueryStringParameterValidationError(`Can not extract parameters`, [filterString])
	}

	if (isLogicalOperator(operator)) {
		const filters = parseLogicalFilterParameters(parameters).map((filter) => parseFilter(filter, decode))
		return new LogicalFilter(operator, filters)
	}

	if (isArrayComparisonOperator(operator)) {
		const [path, ...values] = parameters.split(',')
		return new ArrayComparisonFilter(
			operator,
			path,
			values.map((value) => decode(value))
		)
	}
	if (isNullComparisonOperator(operator)) {
		const [path] = parameters.split(',')
		return new NullComparisonFilter(operator, path)
	}

	if (isValueComparisonOperator(operator)) {
		const [path, value] = parameters.split(',')
		return new ValueComparisonFilter(operator, path, decode(value))
	}

	throw new QueryStringParameterValidationError(`Filter is not valid`, [filterString])
}

/**
 * Extract filter params from parsed query string
 */
export const parse = (filters: string[] | string, decode = decodeURIComponent): Filter[] => {
	if (is(String, filters)) {
		return [parseFilter(filters, decode)]
	}
	if (is(Array, filters)) {
		return filters.filter(is(String)).map((filter) => parseFilter(filter, decode))
	}
	return []
}
