import { Sort } from '@mxvincent/query-params'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'
import { validateSort } from './validateSort'

test('should return sort params', async () => {
	const sort: Sort = Sort.ascending('a.path')
	expect(validateSort(['a.path'], sort)).toEqual(sort)
})

test('should throw error when path is not valid', async () => {
	expect(() => {
		validateSort(['a.path'], Sort.ascending('not.valid'))
	}).toThrowError(new QueryParamsValidationError(`Sort path should be one of: a.path`))
})

test('should throw error when second parameter is not a sort', async () => {
	expect(() => validateSort(['a.path'], {} as never)).toThrowError(
		new TypeError(`Sort validator parameter should be a \`SortParams\``)
	)
})
