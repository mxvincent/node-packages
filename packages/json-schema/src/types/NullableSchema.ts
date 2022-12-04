import { TNull, TSchema, TUnion } from '@sinclair/typebox'

export const NullableSchema = <T extends TSchema>(schema: T): TUnion<[T, TNull]> => {
	return { ...schema, nullable: true } as any
}
