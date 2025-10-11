import { isSort } from './guards'
import { SORT_DIRECTIONS } from './sort'

test.each(SORT_DIRECTIONS)('should return true', (direction) => {
	expect(isSort({ direction, path: 'key' })).toBeTruthy()
})

describe('should return false', () => {
	test('should handle null', () => {
		expect(isSort(null)).toBeFalsy()
	})
	test('should handle array', () => {
		expect(isSort([])).toBeFalsy()
	})
	test('should handle object', () => {
		expect(isSort({})).toBeFalsy()
	})
	test('should handle string', () => {
		expect(isSort('a')).toBeFalsy()
	})
	test('should handle number', () => {
		expect(isSort(1)).toBeFalsy()
	})
	test('should handle undefined', () => {
		expect(isSort(undefined)).toBeFalsy()
	})
})
