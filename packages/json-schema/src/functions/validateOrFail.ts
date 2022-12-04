import { TSchema } from '@sinclair/typebox'
import { ajv } from '../ajv'
import { ValidationError } from '../errors/ValidationError'

export const validateOrFail = <T>(schema: TSchema): ((data: unknown) => T) => {
	const validate = ajv.compile<T>(schema)
	return (data: unknown): T => {
		if (!validate(data)) {
			throw new ValidationError('JSON schema validation failed', validate.errors ?? [], data)
		}
		return data
	}
}
