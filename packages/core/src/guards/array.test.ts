import { isArray } from './array'

test('should return true', () => {
	expect(isArray([])).toBe(true)
})
test.each([undefined, null, false, '123', 123, { k: 'v' }])('should return false', (value) => {
	expect(isArray(value)).toBe(false)
})
