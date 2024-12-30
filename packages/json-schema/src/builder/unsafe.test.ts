import { Kind, Type } from '@sinclair/typebox'
import { Nullable, StringEnum } from './unsafe'

describe('Nullable()', () => {
	test('should make schema nullable', () => {
		const schema = Nullable(Type.String())
		expect(schema).toStrictEqual({
			nullable: true,
			type: 'string',
			[Kind]: 'String'
		})
	})
	test('should set string as default value', async () => {
		const schema = Nullable(Type.String({ default: 'test value' }))
		expect(schema).toStrictEqual({
			default: 'test value',
			nullable: true,
			type: 'string',
			[Kind]: 'String'
		})
	})

	test('should set null as default value (from base schema)', () => {
		const schema = Nullable(Type.String({ default: null }))
		expect(schema).toStrictEqual({
			nullable: true,
			type: 'string',
			default: null,
			[Kind]: 'String'
		})
	})

	test('should set null as default value (from schema modifier)', () => {
		const schema = Nullable(Type.String(), { default: null })
		expect(schema).toStrictEqual({
			nullable: true,
			type: 'string',
			default: null,
			[Kind]: 'String'
		})
	})
})

describe('StringEnum()', () => {
	test('should create string enum', () => {
		const schema = StringEnum(['alice', 'bob', 'charlie'])
		expect(schema).toStrictEqual({
			enum: ['alice', 'bob', 'charlie'],
			type: 'string',
			[Kind]: 'Unsafe'
		})
	})
	test('should set default value', async () => {
		const schema = StringEnum(['alice', 'bob', 'charlie'], { default: 'alice' })
		expect(schema).toStrictEqual({
			default: 'alice',
			enum: ['alice', 'bob', 'charlie'],
			type: 'string',
			[Kind]: 'Unsafe'
		})
	})
})
