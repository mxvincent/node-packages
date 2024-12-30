import { JsonSchemaValidationError, Schema, Type, validate } from '../index'

const getTypeName = (value: unknown) => {
	return Object.prototype.toString
		.call(value)
		.replace(/^\[object\s+([a-z]+)\]$/i, '$1')
		.toLowerCase()
}

const formatData = (value: unknown): { type: string; value: unknown } => ({ type: getTypeName(value), value })

describe('String validation', () => {
	describe('Regular string validation', () => {
		const schema = Type.String()

		test.each(['test value'].map(formatData))('should validate $type', ({ value }) => {
			expect(validate(schema, value)).toBe(value)
		})

		test.each([0, NaN, Infinity, 123, {}, null, undefined, true, false].map(formatData))(
			'should not validate $type',
			async ({ value }) => {
				expect(() => validate(schema, value)).toThrowError(JsonSchemaValidationError)
			}
		)
	})
})

describe('Nullable string validation', () => {
	const schema = Schema.Nullable(Type.String())

	test.each(['test value', null].map(formatData))('should validate $type', ({ value }) => {
		expect(validate(schema, value)).toBe(value)
	})

	test.each([123, {}, undefined].map(formatData))('should not validate $type', ({ value }) => {
		expect(() => validate(schema, value)).toThrowError(JsonSchemaValidationError)
	})
})

describe('Optional type coercion', () => {
	const schema = Type.Number()
	test('should not coerce type by default', async () => {
		expect(() => validate(schema, '123')).toThrowError(JsonSchemaValidationError)
	})
	test('should coerce type by default', async () => {
		expect(validate(schema, '123', { coerce: true })).toEqual(123)
	})
})
