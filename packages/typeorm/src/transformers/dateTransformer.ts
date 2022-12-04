import { is } from 'ramda'
import { ValueTransformer } from 'typeorm'

export const dateTransformer: ValueTransformer = {
	/**
	 * Used to marshal data when writing to the database.
	 */
	to: (value: Date | null): string | null => (is(Date, value) ? value.toISOString() : null),
	/**
	 * Used to unmarshal data when reading from the database.
	 */
	from: (value: string | null): Date | null => (value ? new Date(value) : null)
}
