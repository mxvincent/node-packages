import { ComparisonFilter, LogicalFilter } from '@mxvincent/query-params'
import qs from 'query-string'
import { parseFilters, parseLogicalFilterParameters } from './parse'

describe('parseLogicalFilterParameters()', () => {
	test('should split top level operators as string array', () => {
		expect(parseLogicalFilterParameters('Equal(a,a),Or(Equal(b,b),Equal(c,c))')).toStrictEqual([
			'Equal(a,a)',
			'Or(Equal(b,b),Equal(c,c))'
		])
	})
})

describe('should parse comparison filter', () => {
	test.each([
		{
			queryString: 'filter=equal(status,active)',
			filters: [ComparisonFilter.equal('status', 'active')]
		},
		{
			queryString: 'filter=notEqual(date,2021-01-01T00:00:00.000Z)',
			filters: [ComparisonFilter.notEqual('date', '2021-01-01T00:00:00.000Z')]
		},
		{
			queryString: 'filter=lessThanOrEqual(date,2020-01-01)',
			filters: [ComparisonFilter.lessThanOrEqual('date', '2020-01-01')]
		},
		{
			queryString: 'filter=in(id,1,2,3,4)',
			filters: [ComparisonFilter.in('id', ['1', '2', '3', '4'])]
		},
		{
			queryString: 'filter=notIn(id,a)',
			filters: [ComparisonFilter.notIn('id', ['a'])]
		},
		{
			queryString: 'filter=null(date)',
			filters: [ComparisonFilter.null('date')]
		},
		{
			queryString: 'filter=notNull(date)',
			filters: [ComparisonFilter.notNull('date')]
		}
	])('$queryString', ({ queryString, filters }) => {
		const parsedQueryString = qs.parse(queryString) as { filter: string[] }
		expect(parseFilters(parsedQueryString.filter)).toStrictEqual(filters)
	})
})

describe('should parse logical filters', () => {
	const nestedFilters = [ComparisonFilter.equal('a', 'a'), ComparisonFilter.in('b', ['b', 'b'])]
	test.each([
		{
			queryString: 'filter=or(equal(a,a),in(b,b,b))',
			filters: [LogicalFilter.or(nestedFilters)]
		},
		{
			queryString: 'filter=and(equal(a,a),in(b,b,b))',
			filters: [LogicalFilter.and(nestedFilters)]
		}
	])('$queryString', ({ queryString, filters }) => {
		const parsedQueryString = qs.parse(queryString) as { filter: string[] }
		expect(parseFilters(parsedQueryString.filter)).toStrictEqual(filters)
	})
})

describe('should accept empty string as filter value', () => {
	test.each([
		{
			queryString: 'filter=equal(id,)',
			filters: [ComparisonFilter.equal('id', '')]
		},
		{
			queryString: 'filter=in(id,)',
			filters: [ComparisonFilter.in('id', [''])]
		}
	])('$queryString', ({ queryString, filters }) => {
		const parsedQueryString = qs.parse(queryString) as { filter: string[] }
		expect(parseFilters(parsedQueryString.filter)).toStrictEqual(filters)
	})
})

test('should merge filters from query string', () => {
	const parsedQueryString = qs.parse(
		'filter=equal(a,a)&filter=notEqual(b,b)&filter=or(equal(c,c),greaterThanOrEqual(d,d))'
	) as {
		filter: string[]
	}
	expect(parseFilters(parsedQueryString.filter)).toStrictEqual([
		ComparisonFilter.equal('a', 'a'),
		ComparisonFilter.notEqual('b', 'b'),
		LogicalFilter.or([ComparisonFilter.equal('c', 'c'), ComparisonFilter.greaterThanOrEqual('d', 'd')])
	])
})

test('should parse nested logical filters', () => {
	const parsedQueryString = qs.parse('filter=and(equal(a,a),or(equal(b,b),in(c,c,c)))') as {
		filter: string[]
	}
	expect(parseFilters(parsedQueryString.filter)).toStrictEqual([
		LogicalFilter.and([
			ComparisonFilter.equal('a', 'a'),
			LogicalFilter.or([ComparisonFilter.equal('b', 'b'), ComparisonFilter.in('c', ['c', 'c'])])
		])
	])
})

describe('should decode filter values', () => {
	test.each([
		{ filter: ComparisonFilter.equal('a', 'va,l'), serializedFilter: 'equal(a,va%2Cl)' },
		{ filter: ComparisonFilter.in('a', ['val', 'va,l']), serializedFilter: 'in(a,val,va%2Cl)' }
	])('$serializedFilter', async ({ filter, serializedFilter }) => {
		expect(parseFilters([serializedFilter])).toStrictEqual([filter])
	})
})
