import { Type } from '@sinclair/typebox'

export const QueryStringValueSchema = () => Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())]))

export const QueryStringSchema = () => {
	return Type.Object({
		after: Type.Optional(Type.String({ description: 'Get items after this cursor.' })),
		before: Type.Optional(Type.String({ description: 'Get items before this cursor.' })),
		size: Type.Optional(Type.String({ description: 'Page size.' })),
		filter: QueryStringValueSchema(),
		include: QueryStringValueSchema(),
		sort: QueryStringValueSchema()
	})
}
