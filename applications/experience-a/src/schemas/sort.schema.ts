import { SortDirection } from '@mxvincent/query-params'
import { registerEnumType } from '@nestjs/graphql'

registerEnumType(SortDirection, {
	name: 'SortDirection'
})

export interface GQLSort {
	direction: SortDirection
	field: string
}
