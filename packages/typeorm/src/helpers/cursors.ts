import { isNil } from 'ramda'

export type CursorRelativePosition = 'after' | 'before'

/**
 * Serialize cursor part
 */
export const serializeCursorValue = (value: unknown): string => {
	if (isNil(value)) {
		return '\0'
	}
	switch (typeof value) {
		case 'string':
			return value
		case 'number':
		case 'bigint':
			return String(value)
		case 'object':
			if (value instanceof Date) {
				return value.toISOString()
			}
			break
	}
	throw new TypeError(`unserializable value given as cursor part: ${value}`)
}

/**
 * Parse cursor part from string
 * @param value
 */
export const parseCursorValue = (value: string): string | null => {
	return value === '\0' ? null : value
}
