import { Pagination } from '@mxvincent/query-params'
import qs from 'query-string'
import { parsePagination } from './parse'

describe('should return pagination options', () => {
	test('empty string', async () => {
		expect(parsePagination(qs.parse(''), { defaultPageSize: 10 })).toStrictEqual(Pagination.forward(10))
	})
	test.each([
		{
			queryString: 'first=2',
			pagination: Pagination.forward(2)
		},
		{
			queryString: 'after=cursor&first=2',
			pagination: Pagination.forward(2, 'cursor')
		},
		{
			queryString: 'before=cursor&first=2',
			pagination: Pagination.backward(2, 'cursor')
		}
	])('$queryString', ({ queryString, pagination }) => {
		expect(parsePagination(qs.parse(queryString), { defaultPageSize: 10 })).toStrictEqual(pagination)
	})
})

describe('should return first occurrence when a parameters is duplicated', () => {
	test.each([
		{
			queryString: 'first=2&after=abc&after=def',
			pagination: Pagination.forward(2, 'abc')
		},
		{
			queryString: 'first=2&before=abc&before=def',
			pagination: Pagination.backward(2, 'abc')
		},
		{
			queryString: 'first=10&first=50',
			pagination: Pagination.forward(10)
		},
		{
			queryString: 'first=10&first=50&before=123',
			pagination: Pagination.backward(10, '123')
		}
	])('$queryString', ({ queryString, pagination }) => {
		expect(parsePagination(qs.parse(queryString), { defaultPageSize: 10 })).toStrictEqual(pagination)
	})
})

describe('should ignore parameters without values', () => {
	test.each([
		'after',
		'after=',
		'after&after',
		'after=&after',
		'after=&after=',
		'before',
		'before=',
		'before&before',
		'before=&before',
		'before=&before=',
		'first',
		'first='
	])('%s', (input) => {
		expect(parsePagination(qs.parse(input), { defaultPageSize: 10 })).toStrictEqual(Pagination.forward(10))
	})
})
