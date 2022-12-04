import { isNumber } from '@mxvincent/core'
import { ValueTransformer } from 'typeorm'

export const decimalTransformer: ValueTransformer = {
	/**
	 * Used to marshal data when writing to the database.
	 */
	to: (value: number | null): string | null => (isNumber(value) ? value.toString(10) : null),
	/**
	 * Used to unmarshal data when reading from the database.
	 */
	from: (value: string | null): number | null => (value ? parseFloat(value) : null)
}
