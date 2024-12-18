import { arrayComparisonFilter, logicalFilter, nullComparisonFilter, valueComparisonFilter } from './factories'
import {
	ARRAY_COMPARISON_OPERATORS,
	LOGICAL_OPERATORS,
	NULL_COMPARISON_OPERATORS,
	VALUE_COMPARISON_OPERATORS
} from './operators'

describe('logicalFilter()', () => {
	test.each(LOGICAL_OPERATORS)('should return %s factory', (operator) => {
		expect(logicalFilter(operator)).toBeInstanceOf(Function)
	})
})

describe('arrayComparisonFilter()', () => {
	test.each(ARRAY_COMPARISON_OPERATORS)('should return %s factory', (operator) => {
		expect(arrayComparisonFilter(operator)).toBeInstanceOf(Function)
	})
})

describe('arrayComparisonFilter()', () => {
	test.each(NULL_COMPARISON_OPERATORS)('should return %s factory', (operator) => {
		expect(nullComparisonFilter(operator)).toBeInstanceOf(Function)
	})
})

describe('valueComparisonFilter()', () => {
	test.each(VALUE_COMPARISON_OPERATORS)('should return %s factory', (operator) => {
		expect(valueComparisonFilter(operator)).toBeInstanceOf(Function)
	})
})
