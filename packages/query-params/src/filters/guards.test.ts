import { Filter } from '../types/Filter'
import {
	arrayComparisonOperators,
	comparisonOperators,
	FilterOperator,
	logicalOperators,
	nullComparisonOperators,
	valueComparisonOperators
} from '../types/FilterOperator'
import { arrayComparisonFilter, logicalFilter, Null, nullComparisonFilter, valueComparisonFilter } from './factories'
import {
	isArrayComparisonOperator,
	isComparisonFilter,
	isComparisonOperator,
	isFilter,
	isLogicalFilter,
	isLogicalOperator,
	isNullComparisonOperator,
	isValueComparisonOperator
} from './guards'

describe('Filter guards', () => {
	describe('isComparisonFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>([
				...arrayComparisonOperators.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...nullComparisonOperators.map(nullComparisonFilter).map((factory) => factory('key')),
				...valueComparisonOperators.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
			])('filter: $operator', (value) => {
				expect(isComparisonFilter(value)).toBeTruthy()
			})
		})
		describe('should return false', () => {
			test.each<Filter>(logicalOperators.map(logicalFilter).map((factory) => factory(Null('a'), Null('b'))))(
				'filter: $operator',
				(value) => {
					expect(isComparisonFilter(value)).toBeFalsy()
				}
			)
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

	describe('isLogicalFilter()', () => {
		describe('should return true', () => {
			test.each<Filter>(logicalOperators.map(logicalFilter).map((factory) => factory(Null('a'), Null('b'))))(
				'filter: $operator',
				(value) => {
					expect(isLogicalFilter(value)).toBeTruthy()
				}
			)
		})
		describe('should return false', () => {
			test.each<Filter>([
				...arrayComparisonOperators.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...nullComparisonOperators.map(nullComparisonFilter).map((factory) => factory('key')),
				...valueComparisonOperators.map(valueComparisonFilter).map((factory) => factory('key', 'value'))
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
				...arrayComparisonOperators.map(arrayComparisonFilter).map((factory) => factory('key', ['a', 'b', 'c'])),
				...nullComparisonOperators.map(nullComparisonFilter).map((factory) => factory('key')),
				...valueComparisonOperators.map(valueComparisonFilter).map((factory) => factory('key', 'value')),
				...logicalOperators.map(logicalFilter).map((factory) => factory(Null('a'), Null('b')))
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

describe('FilterOperator guards', () => {
	describe('isArrayComparisonOperator()', () => {
		describe('should return true', () => {
			test.each<FilterOperator>(arrayComparisonOperators)('%s', (value) => {
				expect(isArrayComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each<FilterOperator>([...valueComparisonOperators, ...logicalOperators, ...nullComparisonOperators])(
				'%s',
				(value) => {
					expect(isArrayComparisonOperator(value)).toBeFalsy()
				}
			)
		})
	})

	describe('isNullComparisonOperator()', () => {
		describe('should return true', () => {
			test.each<FilterOperator>(nullComparisonOperators)('%s', (value) => {
				expect(isNullComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each<FilterOperator>([...arrayComparisonOperators, ...logicalOperators, ...valueComparisonOperators])(
				'%s',
				(value) => {
					expect(isNullComparisonOperator(value)).toBeFalsy()
				}
			)
		})
	})

	describe('isValueComparisonOperator()', () => {
		describe('should return true', () => {
			test.each<FilterOperator>(valueComparisonOperators)('%s', (value) => {
				expect(isValueComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each<FilterOperator>([...arrayComparisonOperators, ...logicalOperators, ...nullComparisonOperators])(
				'%s',
				(value) => {
					expect(isValueComparisonOperator(value)).toBeFalsy()
				}
			)
		})
	})

	describe('isComparisonFilterOperator()', () => {
		describe('should return true', () => {
			test.each<FilterOperator>(comparisonOperators)('%s', (value) => {
				expect(isComparisonOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each<FilterOperator>(logicalOperators)('%s', (value) => {
				expect(isComparisonOperator(value)).toBeFalsy()
			})
		})
	})

	describe('isLogicalFilterOperator()', () => {
		describe('should return true', () => {
			test.each<FilterOperator>(logicalOperators)('%s', (value) => {
				expect(isLogicalOperator(value)).toBeTruthy()
			})
		})

		describe('should return false', () => {
			test.each<FilterOperator>(comparisonOperators)('%s', (value) => {
				expect(isLogicalOperator(value)).toBeFalsy()
			})
		})
	})
})
