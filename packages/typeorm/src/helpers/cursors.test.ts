import { parseCursorValue, serializeCursorValue } from './cursors'

describe('serialize cursor value', () => {
	test('should handle string', async () => {
		expect(serializeCursorValue('value')).toEqual('value')
	})
	test('should handle number', async () => {
		expect(serializeCursorValue(1)).toEqual('1')
	})
	test('should handle bigint', async () => {
		expect(serializeCursorValue(1n)).toEqual('1')
	})
	test('should handle date', async () => {
		expect(serializeCursorValue(new Date('2022-01-01T00:00:00Z'))).toEqual('2022-01-01T00:00:00.000Z')
	})
	test('should handle null', async () => {
		expect(serializeCursorValue(null)).toEqual('\0')
	})
	test('should trow type error', async () => {
		expect(() => serializeCursorValue({})).toThrowError(
			TypeError('unserializable value given as cursor part: [object Object]')
		)
	})
})

describe('parse cursor value', () => {
	test('should handle non null value', async () => {
		expect(parseCursorValue('value')).toEqual('value')
	})
	test('should handle null values', async () => {
		expect(parseCursorValue('\0')).toEqual(null)
	})
})
