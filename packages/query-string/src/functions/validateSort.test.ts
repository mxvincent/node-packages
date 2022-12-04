import { Sort } from '@mxvincent/query'
import { QueryStringValidationError } from '../errors/QueryStringValidationError'
import { validateSort } from './validateSort'

test('should return sort params', async () => {
	const sort: Sort = { direction: 'asc', path: 'a.path' }
	expect(validateSort(['a.path'], sort)).toEqual(sort)
})

test('should throw error when path is not valid', async () => {
	expect(() => {
		validateSort(['a.path'], { direction: 'asc', path: 'not.valid' })
	}).toThrow(QueryStringValidationError)
})
