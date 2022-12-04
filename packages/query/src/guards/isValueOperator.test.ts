import { ArrayOperator, ComparisonOperator } from '../types/ComparisonOperator'
import { LogicalOperator } from '../types/LogicalOperator'
import { isValueOperator } from './isValueOperator'

describe('should return true', () => {
	test.each<ComparisonOperator>([
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
		'null'
	])('%s', (value) => {
		expect(isValueOperator(value)).toBeTruthy()
	})
})

describe('should return false', () => {
	test.each<ArrayOperator | LogicalOperator>(['in', 'nin', 'or', 'and'])('%s', (value) => {
		expect(isValueOperator(value)).toBeFalsy()
	})
})
