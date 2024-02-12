import { Equal, Or } from './factories'
import { flattenComparisonPaths, removeDuplicatedFilters } from './utils'

describe('flattenComparisonPaths()', () => {
	test('should return comparison paths', () => {
		expect(flattenComparisonPaths([Or(Equal('a', 'a'), Equal('b', 'b'))])).toStrictEqual(['a', 'b'])
	})

	test('should remove duplicated values', () => {
		expect(flattenComparisonPaths([Or(Equal('a', 'a'), Equal('a', 'a'))])).toStrictEqual(['a'])
	})
})

describe('removeDuplicatedFilters', () => {
	test('should remove duplicated filters', () => {
		const filter = Equal('a', 'a')
		expect(removeDuplicatedFilters([filter, filter])).toStrictEqual([filter])
	})

	test('should handle nested filters', () => {
		const filter = Equal('a', 'a')
		expect(removeDuplicatedFilters([filter, Or(filter, filter)])).toStrictEqual([filter, Or(filter)])
	})
})
