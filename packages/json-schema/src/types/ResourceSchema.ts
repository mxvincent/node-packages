import { ObjectOptions, TObject, TProperties, TString, Type } from '@sinclair/typebox'

export type ResourceProperties = {
	id: TString<'uuid'>
	createdAt: TString<'iso-date-time'>
	updatedAt: TString<'iso-date-time'>
}

export const getResourceProperties = () => ({
	id: Type.String({ format: 'uuid', description: 'Resource unique identifier.' }),
	createdAt: Type.String({
		format: 'iso-date-time',
		description: 'A date representing when this resource was created.'
	}),
	updatedAt: Type.String({
		format: 'iso-date-time',
		description: 'A date representing when this resource was last updated.'
	})
})

export const ResourceSchema = <T extends TProperties>(
	properties: T,
	options?: ObjectOptions
): TObject<ResourceProperties & T> => {
	return Type.Object(Object.assign(getResourceProperties(), properties), options)
}
