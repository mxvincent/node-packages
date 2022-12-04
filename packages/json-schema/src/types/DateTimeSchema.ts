import { TString, Type } from '@sinclair/typebox'

/**
 * ISO 8601 date
 */
export const DateTimeSchema = (options?: { description: string }): TString => {
	return Type.String({ format: 'iso-date-time', description: options?.description })
}
