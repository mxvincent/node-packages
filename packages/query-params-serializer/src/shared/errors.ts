import { ValidationError } from '@mxvincent/core'

export class QueryStringParameterValidationError extends ValidationError<string> {
	code = 'QUERY_STRING_PARAMETER_VALIDATION_ERROR'
}
