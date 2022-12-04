import { parse } from 'query-string'
import { parsePaginationOptions } from './parsePaginationOptions'

describe('should return pagination options', () => {
	test('empty string', async () => {
		expect(parsePaginationOptions(parse(''), { defaultSize: 10 })).toEqual({ type: 'forward', size: 10 })
	})
	test.each([
		{
			queryString: 'size=10',
			pagination: { size: 10, type: 'forward' }
		},
		{
			queryString: 'after=cursor&size=10',
			pagination: { after: 'cursor', size: 10, type: 'forward' }
		},
		{
			queryString: 'before=cursor&size=10',
			pagination: { before: 'cursor', size: 10, type: 'backward' }
		}
	])('$queryString', ({ queryString, pagination }) => {
		expect(parsePaginationOptions(parse(queryString), { defaultSize: 10 })).toEqual(pagination)
	})
})

describe('should return first occurrence when a parameters is duplicated', () => {
	test.each([
		{
			queryString: 'size=2&after=abc&after=def',
			pagination: { type: 'forward', after: 'abc', size: 2 }
		},
		{
			queryString: 'size=2&before=abc&before=def',
			pagination: { type: 'backward', before: 'abc', size: 2 }
		},
		{
			queryString: 'size=10&size=50',
			pagination: { type: 'forward', size: 10 }
		},
		{
			queryString: 'size=10&size=50&before=123',
			pagination: { type: 'backward', size: 10, before: '123' }
		}
	])('$queryString', ({ queryString, pagination }) => {
		expect(parsePaginationOptions(parse(queryString), { defaultSize: 10 })).toEqual(pagination)
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
		'size',
		'size='
	])('%s', (input) => {
		expect(parsePaginationOptions(parse(input), { defaultSize: 10 })).toEqual({ type: 'forward', size: 10 })
	})
})
