import { isNil } from 'ramda'

export type CursorRelativePosition = 'after' | 'before'

/**
 *  Encode string as base64
 */
export const base64Encode = (val: string) => {
	return Buffer.from(val).toString('base64')
}

/**
 * Decode base64 encoded string
 */
export const base64Decode = (val: string) => {
	return Buffer.from(val, 'base64').toString()
}

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
