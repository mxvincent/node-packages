import { ComparisonFilter, LogicalFilter } from '@mxvincent/query-params'
import { parse, parseLogicalFilterParameters } from './parse'

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
			queryStringParameter: ['equal(status,active)'],
			filters: [ComparisonFilter.equal('status', 'active')]
		},
		{
			queryStringParameter: ['notEqual(date,2021-01-01T00:00:00.000Z)'],
			filters: [ComparisonFilter.notEqual('date', '2021-01-01T00:00:00.000Z')]
		},
		{
			queryStringParameter: ['lessThanOrEqual(date,2020-01-01)'],
			filters: [ComparisonFilter.lessThanOrEqual('date', '2020-01-01')]
		},
		{
			queryStringParameter: ['in(id,1,2,3,4)'],
			filters: [ComparisonFilter.in('id', ['1', '2', '3', '4'])]
		},
		{
			queryStringParameter: ['notIn(id,a)'],
			filters: [ComparisonFilter.notIn('id', ['a'])]
		},
		{
			queryStringParameter: ['null(date)'],
			filters: [ComparisonFilter.null('date')]
		},
		{
			queryStringParameter: ['notNull(date)'],
			filters: [ComparisonFilter.notNull('date')]
		}
	])('$queryString', ({ queryStringParameter, filters }) => {
		expect(parse(queryStringParameter)).toStrictEqual(filters)
	})
})

describe('should parse logical filters', () => {
	const nestedFilters = [ComparisonFilter.equal('a', 'a'), ComparisonFilter.in('b', ['b', 'b'])]
	test.each([
		{
			queryStringParameter: 'or(equal(a,a),in(b,b,b))',
			filters: [LogicalFilter.or(nestedFilters)]
		},
		{
			queryStringParameter: 'and(equal(a,a),in(b,b,b))',
			filters: [LogicalFilter.and(nestedFilters)]
		}
	])('$queryString', ({ queryStringParameter, filters }) => {
		expect(parse(queryStringParameter)).toStrictEqual(filters)
	})
})

describe('should accept empty string as filter value', () => {
	test.each([
		{
			queryStringParameter: 'equal(id,)',
			filters: [ComparisonFilter.equal('id', '')]
		},
		{
			queryStringParameter: 'in(id,)',
			filters: [ComparisonFilter.in('id', [''])]
		}
	])('$queryString', ({ queryStringParameter, filters }) => {
		expect(parse(queryStringParameter)).toStrictEqual(filters)
	})
})

test('should merge filters from query string', () => {
	expect(parse(['equal(a,a)', 'notEqual(b,b)', 'or(equal(c,c),greaterThanOrEqual(d,d))'])).toStrictEqual([
		ComparisonFilter.equal('a', 'a'),
		ComparisonFilter.notEqual('b', 'b'),
		LogicalFilter.or([ComparisonFilter.equal('c', 'c'), ComparisonFilter.greaterThanOrEqual('d', 'd')])
	])
})

test('should parse nested logical filters', () => {
	expect(parse('and(equal(a,a),or(equal(b,b),in(c,c,c)))')).toStrictEqual([
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
		expect(parse([serializedFilter])).toStrictEqual([filter])
	})
})
