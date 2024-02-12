import { Static, TSchema } from '@sinclair/typebox'
import { ErrorObject } from 'ajv'
import { JsonSchemaValidationError } from '../errors/JsonSchemaValidationError'
import { ajv } from './ajv'

const createValidationFunction = <T>(schema: TSchema): ((payload: unknown) => T) => {
	const validate = ajv.compile<T>(schema)
	return (payload: unknown): T => {
		if (!validate(payload)) {
			throw new JsonSchemaValidationError('JSON schema validation failed', {
				errors: validate.errors as ErrorObject[],
				payload
			})
		}
		return payload
	}
}

const validators = new Map<TSchema, (value: unknown) => unknown>()

export const getValidationFunction = <T>(schema: TSchema): ((payload: unknown) => T) => {
	let validate = validators.get(schema)
	if (!validate) {
		validate = createValidationFunction<T>(schema)
		validators.set(schema, validate)
	}
	return validate as (payload: unknown) => T
}

export const validate = <T extends TSchema>(schema: T, value: unknown): Static<T> => {
	return getValidationFunction<T>(schema)(value)
}
