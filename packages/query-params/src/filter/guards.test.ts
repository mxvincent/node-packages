import { arrayComparisonFilter, logicalFilter, nullComparisonFilter, valueComparisonFilter } from './factories'
import { ComparisonFilter, Filter } from './filters'
import {
	isArrayComparisonFilter,
	isArrayComparisonOperator,
	isComparisonFilter,
	isFilter,
	isLogicalFilter,
	isLogicalOperator,
	isNullComparisonFilter,
	isNullComparisonOperator,
	isValueComparisonFilter,
	isValueComparisonOperator
} from './guards'
import {
	ARRAY_COMPARISON_OPERATORS,
	LOGICAL_OPERATORS,
	NULL_COMPARISON_OPERATORS,
	VALUE_COMPARISON_OPERATORS
} from './operators'

describe('Filter guards', () => {
	describe('isComparisonFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>([
				...ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')),
				...VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			])('filter: $operator', (value) => {
				expect(isComparisonFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test.each<Filter>(
				LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				)
			)('filter: $operator', (value) => {
				expect(isComparisonFilter(value)).toBeFalsy()
			})
			test('should handle null', () => {
				expect(isComparisonFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isComparisonFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isComparisonFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isComparisonFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isComparisonFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isComparisonFilter(undefined)).toBeFalsy()
			})
		})
	})

	describe('isArrayComparisonFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>(
				ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c']))
			)('filter: $operator', (value) => {
				expect(isArrayComparisonFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test.each<Filter>([
				...LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				),
				...NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')),
				...VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			])('filter: $operator', (value) => {
				expect(isArrayComparisonFilter(value)).toBeFalsy()
			})
			test('should handle null', () => {
				expect(isArrayComparisonFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isArrayComparisonFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isArrayComparisonFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isArrayComparisonFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isArrayComparisonFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isArrayComparisonFilter(undefined)).toBeFalsy()
			})
		})
	})

	describe('isNullComparisonFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>(NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')))(
				'filter: $operator',
				(value) => {
					expect(isNullComparisonFilter(value)).toBeTruthy()
				}
			)
		})
		describe('should return false', () => {
			test.each<Filter>([
				...LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				),
				...ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			])('filter: $operator', (value) => {
				expect(isNullComparisonFilter(value)).toBeFalsy()
			})
			test('should handle null', () => {
				expect(isNullComparisonFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isNullComparisonFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isNullComparisonFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isNullComparisonFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isNullComparisonFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isNullComparisonFilter(undefined)).toBeFalsy()
			})
		})
	})

	describe('isValueComparisonFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>(
				VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			)('filter: $operator', (value) => {
				expect(isValueComparisonFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test.each<Filter>([
				...LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				),
				...NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')),
				...ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c']))
			])('filter: $operator', (value) => {
				expect(isValueComparisonFilter(value)).toBeFalsy()
			})
			test('should handle null', () => {
				expect(isValueComparisonFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isValueComparisonFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isValueComparisonFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isValueComparisonFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isValueComparisonFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isValueComparisonFilter(undefined)).toBeFalsy()
			})
		})
	})

	describe('isLogicalFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>(
				LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				)
			)('filter: $operator', (value) => {
				expect(isLogicalFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test.each<Filter>([
				...ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')),
				...VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			])('filter: $operator', (filter) => {
				expect(isLogicalFilter(filter)).toBeFalsy()
			})
			test('should handle null', () => {
				expect(isLogicalFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isLogicalFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isLogicalFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isLogicalFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isLogicalFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isLogicalFilter(undefined)).toBeFalsy()
			})
		})
	})

	describe('isFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>([
				...ARRAY_COMPARISON_OPERATORS.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...NULL_COMPARISON_OPERATORS.map(nullComparisonFilter).map((factory) => factory('key')),
				...VALUE_COMPARISON_OPERATORS.map(valueComparisonFilter).map((factory) => factory('key', 'value')),
				...LOGICAL_OPERATORS.map(logicalFilter).map((factory) =>
					factory([ComparisonFilter.null('a'), ComparisonFilter.null('b')])
				)
			])('filter: $operator', (value) => {
				expect(isFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test('should handle null', () => {
				expect(isFilter(null)).toBeFalsy()
			})
			test('should handle array', () => {
				expect(isFilter([])).toBeFalsy()
			})
			test('should handle object', () => {
				expect(isFilter({})).toBeFalsy()
			})
			test('should handle string', () => {
				expect(isFilter('a')).toBeFalsy()
			})
			test('should handle number', () => {
				expect(isFilter(1)).toBeFalsy()
			})
			test('should handle undefined', () => {
				expect(isFilter(undefined)).toBeFalsy()
			})
		})
	})
})

describe('Operator guards', () => {
	describe('isArrayComparisonOperator()', () => {
		describe('should return true', () => {
			test.each(ARRAY_COMPARISON_OPERATORS)('%s', (value) => {
				expect(isArrayComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each([...VALUE_COMPARISON_OPERATORS, ...LOGICAL_OPERATORS, ...NULL_COMPARISON_OPERATORS])('%s', (value) => {
				expect(isArrayComparisonOperator(value)).toBeFalsy()
			})
		})
	})

	describe('isNullComparisonOperator()', () => {
		describe('should return true', () => {
			test.each(NULL_COMPARISON_OPERATORS)('%s', (value) => {
				expect(isNullComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each([...ARRAY_COMPARISON_OPERATORS, ...LOGICAL_OPERATORS, ...VALUE_COMPARISON_OPERATORS])('%s', (value) => {
				expect(isNullComparisonOperator(value)).toBeFalsy()
			})
		})
	})

	describe('isValueComparisonOperator()', () => {
		describe('should return true', () => {
			test.each(VALUE_COMPARISON_OPERATORS)('%s', (value) => {
				expect(isValueComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each([...ARRAY_COMPARISON_OPERATORS, ...LOGICAL_OPERATORS, ...NULL_COMPARISON_OPERATORS])('%s', (value) => {
				expect(isValueComparisonOperator(value)).toBeFalsy()
			})
		})
	})

	describe('isLogicalOperator()', () => {
		describe('should return true', () => {
			test.each(LOGICAL_OPERATORS)('%s', (value) => {
				expect(isLogicalOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each([...ARRAY_COMPARISON_OPERATORS, ...NULL_COMPARISON_OPERATORS, ...NULL_COMPARISON_OPERATORS])(
				'%s',
				(value) => {
					expect(isLogicalOperator(value)).toBeFalsy()
				}
			)
		})
	})
})
