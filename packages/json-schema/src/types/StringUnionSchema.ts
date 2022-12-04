import { StringOptions, TLiteral, TUnion } from '@sinclair/typebox'

type IntoStringUnion<T> = { [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never }

export const StringUnionSchema = <T extends string[]>(
	values: [...T],
	options?: StringOptions<any>
): TUnion<IntoStringUnion<T>> => {
	return { type: 'string', enum: values, ...options } as any
}
