import { Equal, Filter } from '@mxvincent/query-params'
import { QueryParamsValidationError } from '../errors/QueryParamsValidationError'
import { validateFilter } from './validateFilter'

test('should return filter params', async () => {
	const filter: Filter = Equal('a.path', '123')
	expect(validateFilter(['a.path'], filter)).toEqual(filter)
})

test('should throw error when path is not valid', async () => {
	expect(() => {
		validateFilter(['a.path', 'aProperty'], Equal('not.valid', '123'))
	}).toThrowError(new QueryParamsValidationError(`Filter path should be one of: a.path aProperty`))
})

test('should throw error when second parameter is not a filter', async () => {
	expect(() => validateFilter(['a.path'], {} as never)).toThrowError(
		new TypeError(`Filter validator parameter should be a \`FilterParams\``)
	)
})
