import { ComparisonFilter, LogicalFilter } from './filters'
import { flattenComparisonPaths, removeDuplicatedFilters } from './utils'

describe('flattenComparisonPaths()', () => {
	test('should return comparison paths', () => {
		expect(
			flattenComparisonPaths([LogicalFilter.or([ComparisonFilter.equal('a', 'a'), ComparisonFilter.equal('b', 'b')])])
		).toStrictEqual(['a', 'b'])
	})

	test('should remove duplicated values', () => {
		expect(
			flattenComparisonPaths([LogicalFilter.or([ComparisonFilter.equal('a', 'a'), ComparisonFilter.equal('a', 'a')])])
		).toStrictEqual(['a'])
	})
})

describe('removeDuplicatedFilters', () => {
	test('should remove duplicated filters', () => {
		const filter = ComparisonFilter.equal('a', 'a')
		expect(removeDuplicatedFilters([filter, filter])).toStrictEqual([filter])
	})

	test('should handle nested filters', () => {
		const filter = ComparisonFilter.equal('a', 'a')
		expect(removeDuplicatedFilters([filter, LogicalFilter.or([filter, filter])])).toStrictEqual([
			filter,
			LogicalFilter.or([filter])
		])
	})
})
