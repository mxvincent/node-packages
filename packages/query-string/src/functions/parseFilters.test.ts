import { parse } from 'query-string'
import { parseFilters, parseLogicalFilter } from './parseFilters'

describe('parse logical filter string', () => {
	test('should split top level operators as string array', () => {
		expect(parseLogicalFilter('eq(a,a),or(eq(b,b),eq(c,c))')).toEqual(['eq(a,a)', 'or(eq(b,b),eq(c,c))'])
	})
})

describe('should parse comparison filter', () => {
	test.each([
		{
			queryString: 'filter=eq(status,active)',
			filters: [{ type: 'comparison', path: 'status', operator: 'eq', value: 'active' }]
		},
		{
			queryString: 'filter=eq(date,2020-01-01)',
			filters: [{ type: 'comparison', path: 'date', operator: 'eq', value: '2020-01-01' }]
		},
		{
			queryString: 'filter=lte(date,2020-01-01)',
			filters: [{ type: 'comparison', path: 'date', operator: 'lte', value: '2020-01-01' }]
		},
		{
			queryString: 'filter=in(id,1,2,3,4)',
			filters: [{ type: 'comparison', path: 'id', operator: 'in', value: ['1', '2', '3', '4'] }]
		},
		{
			queryString: 'filter=nin(id,a)',
			filters: [{ type: 'comparison', path: 'id', operator: 'nin', value: ['a'] }]
		},
		{
			queryString: 'filter=eq(date,2021-01-01T00:00:00.000Z)',
			filters: [{ type: 'comparison', path: 'date', operator: 'eq', value: '2021-01-01T00:00:00.000Z' }]
		},
		{
			queryString: 'filter=null(date)',
			filters: [{ type: 'comparison', path: 'date', operator: 'null' }]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(parse(queryString))).toEqual(filters)
	})
})

describe('should parse logical filters', () => {
	test.each([
		{
			queryString: 'filter=or(eq(a,a),in(b,b,b))',
			filters: [
				{
					type: 'logical',
					operator: 'or',
					filters: [
						{ type: 'comparison', operator: 'eq', path: 'a', value: 'a' },
						{ type: 'comparison', operator: 'in', path: 'b', value: ['b', 'b'] }
					]
				}
			]
		},
		{
			queryString: 'filter=and(eq(a,a),in(b,b,b))',
			filters: [
				{
					type: 'logical',
					operator: 'and',
					filters: [
						{ type: 'comparison', operator: 'eq', path: 'a', value: 'a' },
						{ type: 'comparison', operator: 'in', path: 'b', value: ['b', 'b'] }
					]
				}
			]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(parse(queryString))).toEqual(filters)
	})
})

describe('should accept empty string as filter value', () => {
	test.each([
		{
			queryString: 'filter=eq(id,)',
			filters: [{ path: 'id', operator: 'eq', value: '', type: 'comparison' }]
		},
		{
			queryString: 'filter=in(id,)',
			filters: [{ path: 'id', operator: 'in', value: [''], type: 'comparison' }]
		}
	])('$queryString', ({ queryString, filters }) => {
		expect(parseFilters(parse(queryString))).toEqual(filters)
	})
})

test('should merge filters from query string', () => {
	expect(parseFilters(parse('filter=eq(a,a)&filter=neq(b,b)&filter=or(eq(c,c),gte(d,d))'))).toEqual([
		{ type: 'comparison', operator: 'eq', path: 'a', value: 'a' },
		{ type: 'comparison', operator: 'neq', path: 'b', value: 'b' },
		{
			type: 'logical',
			operator: 'or',
			filters: [
				{ type: 'comparison', operator: 'eq', path: 'c', value: 'c' },
				{ type: 'comparison', operator: 'gte', path: 'd', value: 'd' }
			]
		}
	])
})

test('should handle duplicated parameters by taking first', () => {
	expect(parseFilters(parse('filter=in(id,a)&filter=in(id,b,c)'))).toEqual([
		{ path: 'id', operator: 'in', value: ['a'], type: 'comparison' }
	])
})

test('should parse nested logical filters', () => {
	expect(parseFilters(parse('filter=and(eq(a,a),or(eq(b,b),in(c,c,c)))'))).toEqual([
		{
			type: 'logical',
			operator: 'and',
			filters: [
				{ type: 'comparison', operator: 'eq', path: 'a', value: 'a' },
				{
					type: 'logical',
					operator: 'or',
					filters: [
						{ type: 'comparison', operator: 'eq', path: 'b', value: 'b' },
						{ type: 'comparison', operator: 'in', path: 'c', value: ['c', 'c'] }
					]
				}
			]
		}
	])
})
