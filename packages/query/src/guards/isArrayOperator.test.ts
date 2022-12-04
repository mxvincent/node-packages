import { ArrayOperator, ComparisonOperator } from '../types/ComparisonOperator'
import { LogicalOperator } from '../types/LogicalOperator'
import { isArrayOperator } from './isArrayOperator'

describe('should return true', () => {
	test.each<ArrayOperator>(['in', 'nin'])('%s', (value) => {
		expect(isArrayOperator(value)).toBeTruthy()
	})
})

describe('should return false', () => {
	test.each<ComparisonOperator | LogicalOperator>([
		'eq',
		'neq',
		'lt',
		'lte',
		'gt',
		'gte',
		'like',
		'nlike',
		'match',
		'imatch',
		'regex',
		'null',
		'or',
		'and'
	])('%s', (value) => {
		expect(isArrayOperator(value)).toBeFalsy()
	})
})
