import { Pagination } from '@mxvincent/query-params'
import { QueryStringRecord } from '../types/QueryStringRecord'
import { parsePagination } from './parse'

describe('should return pagination options', () => {
	test('no parameters', async () => {
		expect(parsePagination({}, { defaultPageSize: 10 })).toStrictEqual(Pagination.forward(10))
	})
	test.each<{ parameters: QueryStringRecord; pagination: Pagination }>([
		{
			parameters: { first: '2' },
			pagination: Pagination.forward(2)
		},
		{
			parameters: { first: '2', after: 'cursor' },
			pagination: Pagination.forward(2, 'cursor')
		},
		{
			parameters: { first: '2', before: 'cursor' },
			pagination: Pagination.backward(2, 'cursor')
		}
	])('$queryString', ({ parameters, pagination }) => {
		expect(parsePagination(parameters)).toStrictEqual(pagination)
	})
})

describe('should return first occurrence when a parameters is duplicated', () => {
	test.each<{ parameters: QueryStringRecord; pagination: Pagination }>([
		{
			parameters: { first: '2', after: ['abc', 'def'] },
			pagination: Pagination.forward(2, 'abc')
		},
		{
			parameters: { first: '2', before: ['abc', 'def'] },
			pagination: Pagination.backward(2, 'abc')
		},
		{
			parameters: { first: ['10', '50'] },
			pagination: Pagination.forward(10)
		},
		{
			parameters: { first: ['10', '50'], before: '123' },
			pagination: Pagination.backward(10, '123')
		}
	])('$queryString', ({ parameters, pagination }) => {
		expect(parsePagination(parameters, { defaultPageSize: 10 })).toStrictEqual(pagination)
	})
})

describe('should ignore parameters without values', () => {
	test.each<QueryStringRecord>([{ after: '' }, { before: '' }, { after: '', before: '' }])('%s', (parameters) => {
		expect(parsePagination(parameters, { defaultPageSize: 10 })).toStrictEqual(Pagination.forward(10))
	})
})
