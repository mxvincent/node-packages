import { Pagination } from '@mxvincent/query-params'
import { QueryStringRecord } from '../types/query-string'
import { parsePagination } from './parse'

describe('should return pagination options', () => {
	Pagination.DEFAULT_PAGE_SIZE = 10
	test('no parameters', async () => {
		expect(parsePagination({}, { defaultPageSize: 20 })).toStrictEqual(Pagination.take(20))
	})
	test.each<{ parameters: QueryStringRecord; pagination: Pagination }>([
		{
			parameters: { take: '2' },
			pagination: Pagination.take(2)
		},
		{
			parameters: { take: '2', after: 'cursor' },
			pagination: Pagination.take(2, 'cursor')
		},
		{
			parameters: { after: 'cursor' },
			pagination: Pagination.take(Pagination.DEFAULT_PAGE_SIZE, 'cursor')
		}
	])('$parameters', ({ parameters, pagination }) => {
		expect(parsePagination(parameters)).toStrictEqual(pagination)
	})
})

describe('should return first occurrence when a parameters is duplicated', () => {
	test.each<{ parameters: Record<string, string | string[]>; pagination: Pagination }>([
		{
			parameters: { take: '2', after: ['abc', 'def'] },
			pagination: Pagination.take(2, 'abc')
		},

		{
			parameters: { take: ['10', '50'] },
			pagination: Pagination.take(10)
		}
	])('$parameters', ({ parameters, pagination }) => {
		expect(parsePagination(parameters, { defaultPageSize: 10 })).toStrictEqual(pagination)
	})
})

test('should ignore cursor without value', () => {
	expect(parsePagination({ after: '' }, { defaultPageSize: 10 })).toStrictEqual(Pagination.take(10))
})
