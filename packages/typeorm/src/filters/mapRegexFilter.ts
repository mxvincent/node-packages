import { CaseInsensitiveMatch, ComparisonFilter, Filter, Match, parseRegexString } from '@mxvincent/query'
import { omit } from 'ramda'

/**
 * Cast `Regex` filter to `Match` or `CaseInsensitiveMatch`
 */
export const mapRegexFilter = (filter: Filter): Filter => {
	if (filter.type === 'logical') {
		return {
			filters: filter.filters.map(mapRegexFilter) as ComparisonFilter[],
			...omit(['filters'], filter)
		}
	}
	if (filter.operator === 'regex' && typeof filter.value === 'string') {
		const { pattern, flags } = parseRegexString(filter.value)
		if (flags?.includes('i')) {
			return CaseInsensitiveMatch(filter.path, pattern)
		}
		return Match(filter.path, pattern)
	}
	return filter
}
