import { isSort } from './guards'

test('should return true', () => {
	expect(isSort({ direction: 'asc', path: 'key' }))
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
