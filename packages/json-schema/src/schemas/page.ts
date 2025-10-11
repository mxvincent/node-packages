import { TSchema, Type } from '@sinclair/typebox'
import { Nullable } from '../builder/unsafe'

export const PageSchema = <T extends TSchema>(DataSchema: T) => {
	return Type.Object({
		data: Type.Array(DataSchema),
		pageInfo: Type.Object({
			hasNextPage: Type.Boolean(),
			hasPrevPage: Type.Boolean(),
			startCursor: Nullable(Type.String()),
			endCursor: Nullable(Type.String())
		}),
		totalCount: Type.Integer()
	})
}
