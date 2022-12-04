import { NullableSchema } from '@mxvincent/json-schema'
import { TObject, Type } from '@sinclair/typebox'

export const PaginationResultSchema = <T extends TObject>(type: TObject) => {
	return Type.Object({
		data: Type.Array(type.$id ? Type.Ref(type) : type),
		hasNextPage: Type.Boolean(),
		hasPrevPage: Type.Boolean(),
		totalCount: Type.Integer(),
		startCursor: NullableSchema(Type.String()),
		endCursor: NullableSchema(Type.String())
	})
}
