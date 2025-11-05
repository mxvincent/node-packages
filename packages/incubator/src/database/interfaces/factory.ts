import { ObjectLiteral } from '@mxvincent/core'

export interface FactoryInterface<TResult extends ObjectLiteral, TValues = Partial<TResult>> {
	create: (values: TValues) => TResult
}
