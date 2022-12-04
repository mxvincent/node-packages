import { isArray, isString } from '@mxvincent/core'
import {
	ComparisonFilter,
	Filter,
	getFilterType,
	isValueOperator,
	LogicalFilter,
	removeDuplicatedFilters
} from '@mxvincent/query'
import { QueryStringRecord } from '../types/QueryStringRecord'

/**
 * Filters can be nested when we use logical filters
 * We need to get all filters from the top level as string
 * For the following input: 'eq(a,a),or(eq(b,b),eq(c,c))'
 * We have two filters on top level:
 *   - eq(a,a)
 *   - or(eq(b,b),eq(c,c))
 */
export const parseLogicalFilter = (filterString: string): string[] => {
	if (!isString(filterString)) {
		throw new TypeError(`filterString should be a string`)
	}
	const result: string[] = []
	let depth = 0
	let start = 0
	for (let index = 0; index < filterString.length; index += 1) {
		if (filterString[index] === '(') {
			depth += 1
		} else if (filterString[index] === ')') {
			depth -= 1
			if (depth === 0) {
				filterString.slice(start, index + 1)
				result.push(filterString.slice(start, index + 1))
				start = index + 2
			}
		}
	}
	return result
}

/**
 * Parse filter string
 */
const parseFilterString = (filterString: string): Filter[] => {
	const matches = filterString.match(/^((?<operator>[a-z]+)\()?(?<parameters>.*)\)$/)

	// reject malformed string with and empty array
	if (!matches?.groups || !isString(matches.groups.operator) || !isString(matches.groups.parameters)) {
		return []
	}

	const filterParameters = matches.groups.parameters
	const filter = {
		operator: matches.groups.operator,
		type: getFilterType(matches.groups.operator)
	}

	if (filter.type === 'comparison') {
		const [path, ...values] = filterParameters.split(',')
		return [{ ...filter, path, value: isValueOperator(filter.operator) ? values[0] : values } as ComparisonFilter]
	}

	if (filter.type === 'logical') {
		const filters = parseLogicalFilter(filterParameters)
		return [{ ...filter, filters: removeDuplicatedFilters(filters.flatMap(parseFilterString)) } as LogicalFilter]
	}

	return []
}

/**
 * Extract filter params from parsed query string
 */
export const parseFilters = ({ filter }: QueryStringRecord): Filter[] => {
	if (isString(filter)) {
		return parseFilterString(filter)
	}
	if (isArray<string>(filter)) {
		return removeDuplicatedFilters(filter.filter(isString).flatMap(parseFilterString))
	}
	return []
}
