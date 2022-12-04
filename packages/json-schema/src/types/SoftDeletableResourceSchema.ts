import { ObjectOptions, TNull, TObject, TProperties, TString, TUnion, Type } from '@sinclair/typebox'
import { NullableSchema } from './NullableSchema'
import { getResourceProperties, ResourceProperties } from './ResourceSchema'

export type SoftDeletableResourceProperties = ResourceProperties & {
	deletedAt: TUnion<[TString<'iso-date-time'>, TNull]>
}

export const getSoftDeletableResourceProperties = () => ({
	...getResourceProperties(),
	deletedAt: NullableSchema(
		Type.String({
			format: 'iso-date-time',
			description: 'A date representing when this resource was deleted.'
		})
	)
})

export const SoftDeletableResourceSchema = <T extends TProperties>(
	properties: T,
	options?: ObjectOptions
): TObject<SoftDeletableResourceProperties & T> => {
	return Type.Object(Object.assign(properties, getSoftDeletableResourceProperties()), options)
}
