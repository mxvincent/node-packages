import { isString } from '@mxvincent/core'
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

export const SHA1RE = /\b([a-f0-9]{40})\b/
export const UUIDv4RE = /\b[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\b/i

const assertSHA1 = (value: unknown) => {
	if (isString(value) && SHA1RE.test(value)) {
		return value
	}
	throw new TypeError(`Value is not a valid SHA1 hash: ${value}`)
}

export const SHA1 = new GraphQLScalarType({
	name: 'SHA1',
	description: 'A SHA1 cryptographic hash function result.',
	parseValue: assertSHA1,
	serialize: assertSHA1,
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings as SHA1 but got a: ${ast.kind}`)
		}
		if (!SHA1RE.test(ast.value)) {
			throw new TypeError(`Value is not a valid sha1 hash: ${ast.value}`)
		}
		return ast.value
	}
})

const assertUUID = (value: unknown) => {
	if (isString(value) && UUIDv4RE.test(value)) {
		return value
	}
	throw new TypeError(`Value is not a valid UUID: ${value}`)
}

export const UUID = new GraphQLScalarType({
	name: 'UUID',
	description: 'An UUID v4 hexadecimal representation.',

	parseValue: assertUUID,
	serialize: assertUUID,
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new GraphQLError(`Can only validate strings but got a: ${ast.kind}`)
		}
		if (!UUIDv4RE.test(ast.value)) {
			throw new TypeError(`Value is not a valid UUID v4: ${ast.value}`)
		}
		return ast.value
	}
})
