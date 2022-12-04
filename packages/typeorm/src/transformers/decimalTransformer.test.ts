import { decimalTransformer } from './decimalTransformer'

const asNumber = 99.99
const asString = '99.99'

describe('to database', () => {
	test('should handle number', async () => {
		expect(decimalTransformer.to(asNumber)).toStrictEqual(asString)
	})
	test('should handle null', async () => {
		expect(decimalTransformer.to(null)).toBeNull()
	})
	test('should handle undefined', async () => {
		expect(decimalTransformer.to(undefined)).toBeNull()
	})
})

describe('from database', () => {
	test('should handle string', async () => {
		const result = decimalTransformer.from(asString)
		expect(result).toStrictEqual(asNumber)
	})
	test('should handle null', async () => {
		expect(decimalTransformer.from(null)).toBeNull()
	})
	test('should handle undefined', async () => {
		expect(decimalTransformer.from(undefined)).toBeNull()
	})
})
