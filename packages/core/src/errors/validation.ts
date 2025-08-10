import { BaseError } from './base'

export class ValidationError<ErrorType> extends BaseError {
	code = 'VALIDATION_ERROR'
	errors!: ErrorType[]

	constructor(message: string, errors: ErrorType[]) {
		super(message)
		this.errors = errors
	}

	toJSON() {
		return {
			...super.toJSON(),
			reasons: this.errors
		}
	}
}
