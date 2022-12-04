import { dateTransformer } from './dateTransformer'

const asString = '2022-01-01T00:00:00.000Z'
const asDate = new Date(asString)

describe('to database', () => {
	test('should handle date', async () => {
		expect(dateTransformer.to(asDate)).toStrictEqual(asString)
	})
	test('should handle null', async () => {
		expect(dateTransformer.to(null)).toBeNull()
	})
	test('should handle undefined', async () => {
		expect(dateTransformer.to(undefined)).toBeNull()
	})
})

describe('from database', () => {
	test('should handle string', async () => {
		const result = dateTransformer.from(asString)
		expect(result).toBeInstanceOf(Date)
		expect(result).toStrictEqual(asDate)
	})
	test('should handle null', async () => {
		expect(dateTransformer.from(null)).toBeNull()
	})
	test('should handle undefined', async () => {
		expect(dateTransformer.from(undefined)).toBeNull()
	})
})
