import { Sort } from '@mxvincent/query-params'
import { parseSorts } from './parse'

describe('return sort options', () => {
	test.each([
		{
			queryStringParams: 'createdAt',
			params: [Sort.asc('createdAt')]
		},
		{
			queryStringParams: 'asc(createdAt)',
			params: [Sort.asc('createdAt')]
		},
		{
			queryStringParams: 'desc(deletedAt)',
			params: [Sort.desc('deletedAt')]
		},
		{
			queryStringParams: ['id', 'desc(updatedAt)'],
			params: [Sort.asc('id'), Sort.desc('updatedAt')]
		}
	])('$queryStringParams', ({ queryStringParams, params }) => {
		expect(parseSorts(queryStringParams)).toEqual(params)
	})
})

test('should handle patch with nested properties', () => {
	expect(parseSorts(`desc(user.fullName)`)).toEqual([Sort.desc('user.fullName')])
})

test('should return many sort options', () => {
	expect(parseSorts(['asc(createdAt)', 'desc(updatedAt)'])).toEqual([Sort.asc('createdAt'), Sort.desc('updatedAt')])
})

test('should take first when sort path is used twice', () => {
	expect(parseSorts(['asc(createdAt)', 'desc(createdAt)'])).toEqual([Sort.asc('createdAt')])
})
