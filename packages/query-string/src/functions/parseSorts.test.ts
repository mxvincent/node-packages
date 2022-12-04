import { parse } from 'query-string'
import { parseSorts } from './parseSorts'

describe('return sort options', () => {
	test.each([
		{
			queryString: 'sort=createdAt',
			params: [{ path: 'createdAt', direction: 'asc' }]
		},
		{
			queryString: 'sort=asc(createdAt)',
			params: [{ path: 'createdAt', direction: 'asc' }]
		},
		{
			queryString: 'sort=desc(deletedAt)',
			params: [{ path: 'deletedAt', direction: 'desc' }]
		},
		{
			queryString: 'sort=id&sort=desc(updatedAt)',
			params: [
				{ path: 'id', direction: 'asc' },
				{ path: 'updatedAt', direction: 'desc' }
			]
		}
	])('$queryString', ({ queryString, params }) => {
		expect(parseSorts(parse(queryString))).toEqual(params)
	})
})

test('should handle patch with nested properties', () => {
	expect(parseSorts(parse(`sort=desc(user.fullName)`))).toEqual([{ path: 'user.fullName', direction: 'desc' }])
})

test('should return many sort options', () => {
	expect(parseSorts(parse('sort=asc(createdAt)&sort=desc(updatedAt)'))).toEqual([
		{ path: 'createdAt', direction: 'asc' },
		{ path: 'updatedAt', direction: 'desc' }
	])
})

test('should take first when sort path is used twice', () => {
	expect(parseSorts(parse('sort=asc(createdAt)&sort=desc(createdAt)'))).toEqual([
		{ path: 'createdAt', direction: 'asc' }
	])
})
