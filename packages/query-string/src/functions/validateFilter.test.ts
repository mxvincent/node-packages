import { Filter } from '@mxvincent/query'
import { QueryStringValidationError } from '../errors/QueryStringValidationError'
import { validateFilter } from './validateFilter'

test('should return filter params', async () => {
	const filter: Filter = { path: 'a.path', operator: 'eq', value: '123', type: 'comparison' }
	expect(validateFilter(['a.path'], filter)).toEqual(filter)
})

test('should throw error when path is not valid', async () => {
	expect(() => {
		validateFilter(['a.path'], {
			path: 'not.valid',
			operator: 'eq',
			value: '123',
			type: 'comparison'
		})
	}).toThrow(QueryStringValidationError)
})
