import { transformers } from './transformers'

describe('date transformer', () => {
	const asString = '2022-01-01T00:00:00.000Z'
	const asDate = new Date(asString)

	describe('to database', () => {
		test('should handle date', async () => {
			expect(transformers.date.to(asDate)).toStrictEqual(asString)
		})
		test('should handle null', async () => {
			expect(transformers.date.to(null)).toBeNull()
		})
		test('should handle undefined', async () => {
			expect(transformers.date.to(undefined)).toBeUndefined()
		})
	})

	describe('from database', () => {
		test('should handle string', async () => {
			const result = transformers.date.from(asString)
			expect(result).toBeInstanceOf(Date)
			expect(result).toStrictEqual(asDate)
		})
		test('should handle null', async () => {
			expect(transformers.date.from(null)).toBeNull()
		})
		test('should handle undefined', async () => {
			expect(transformers.date.from(undefined)).toBeNull()
		})
	})
})

describe('decimal transformer', () => {
	const asNumber = 99.99
	const asString = '99.99'

	describe('to database', () => {
		test('should handle number', async () => {
			expect(transformers.decimal.to(asNumber)).toStrictEqual(asString)
		})
		test('should handle null', async () => {
			expect(transformers.decimal.to(null)).toBeNull()
		})
		test('should handle undefined', async () => {
			expect(transformers.decimal.to(undefined)).toBeUndefined()
		})
	})

	describe('from database', () => {
		test('should handle string', async () => {
			const result = transformers.decimal.from(asString)
			expect(result).toStrictEqual(asNumber)
		})
		test('should handle null', async () => {
			expect(transformers.decimal.from(null)).toBeNull()
		})
		test('should handle undefined', async () => {
			expect(transformers.decimal.from(undefined)).toBeNull()
		})
	})
})
