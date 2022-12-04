import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export const ajv = new Ajv({
	allErrors: true,
	coerceTypes: true,
	removeAdditional: false,
	useDefaults: true
})

addFormats(ajv)

ajv
	.addKeyword('exclusiveMinimumTimestamp')
	.addKeyword('exclusiveMaximumTimestamp')
	.addKeyword('minimumTimestamp')
	.addKeyword('maximumTimestamp')
	.addKeyword('minByteLength')
	.addKeyword('maxByteLength')
