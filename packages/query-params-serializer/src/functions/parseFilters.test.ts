import {
	And,
	Equal,
	GreaterThanOrEqual,
	In,
	LessThanOrEqual,
	NotEqual,
	NotIn,
	NotNull,
	Null,
	Or
} from '@mxvincent/query-params'
import qs from 'query-string'
import { parseFilters, parseLogicalFilterParameters } from './parseFilters'

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
			filters: [Equal('status', 'active')]
		},
		{
			queryString: 'filter=notEqual(date,2021-01-01T00:00:00.000Z)',
			filters: [NotEqual('date', '2021-01-01T00:00:00.000Z')]
		},
		{
			queryString: 'filter=lessThanOrEqual(date,2020-01-01)',
			filters: [LessThanOrEqual('date', '2020-01-01')]
		},
		{
			queryString: 'filter=in(id,1,2,3,4)',
			filters: [In('id', ['1', '2', '3', '4'])]
		},
		{
			queryString: 'filter=notIn(id,a)',
			filters: [NotIn('id', ['a'])]
		},
		{
			queryString: 'filter=null(date)',
			filters: [Null('date')]
		},
		{
			queryString: 'filter=notNull(date)',
			filters: [NotNull('date')]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(qs.parse(queryString))).toStrictEqual(filters)
	})
})

describe('should parse logical filters', () => {
	test.each([
		{
			queryString: 'filter=or(equal(a,a),in(b,b,b))',
			filters: [Or(Equal('a', 'a'), In('b', ['b', 'b']))]
		},
		{
			queryString: 'filter=and(equal(a,a),in(b,b,b))',
			filters: [And(Equal('a', 'a'), In('b', ['b', 'b']))]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(qs.parse(queryString))).toStrictEqual(filters)
	})
})

describe('should accept empty string as filter value', () => {
	test.each([
		{
			queryString: 'filter=equal(id,)',
			filters: [Equal('id', '')]
		},
		{
			queryString: 'filter=in(id,)',
			filters: [In('id', [''])]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(qs.parse(queryString))).toStrictEqual(filters)
	})
})

test('should merge filters from query string', () => {
	expect(
		parseFilters(qs.parse('filter=equal(a,a)&filter=notEqual(b,b)&filter=or(equal(c,c),greaterThanOrEqual(d,d))'))
	).toStrictEqual([Equal('a', 'a'), NotEqual('b', 'b'), Or(Equal('c', 'c'), GreaterThanOrEqual('d', 'd'))])
})

test('should handle duplicated parameters by taking first', () => {
	expect(parseFilters(qs.parse('filter=in(id,a)&filter=in(id,b,c)'))).toStrictEqual([In('id', ['a'])])
})

test('should parse nested logical filters', () => {
	expect(parseFilters(qs.parse('filter=and(equal(a,a),or(equal(b,b),in(c,c,c)))'))).toStrictEqual([
		And(Equal('a', 'a'), Or(Equal('b', 'b'), In('c', ['c', 'c'])))
	])
})

describe('should decode filter values', () => {
	test.each([
		{ filter: Equal('a', 'va,l'), serializedFilter: 'equal(a,va%2Cl)' },
		{ filter: In('a', ['val', 'va,l']), serializedFilter: 'in(a,val,va%2Cl)' }
	])('$serializedFilter', async ({ filter, serializedFilter }) => {
		expect(parseFilters({ filter: [serializedFilter] })).toStrictEqual([filter])
	})
})
