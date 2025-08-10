import { GQLConnection, GQLEdge, PageInfo, SortDirection } from '@mxvincent/query-params'
import { Type } from '@nestjs/common'
import { ArgsType, Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsBase64, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

registerEnumType(SortDirection, {
	name: 'SortDirection'
})

@ArgsType()
@InputType({ isAbstract: true })
export class GQLPagination {
	@IsInt()
	@Min(1)
	@Max(100)
	@Field(() => Int, { defaultValue: 10, description: 'Return n first edges (min=1,max=100)' })
	first!: number

	@IsOptional()
	@IsString()
	@IsBase64()
	@Field(() => String, { nullable: true })
	after?: string

	@IsOptional()
	@IsString()
	@IsBase64()
	@Field(() => String, { nullable: true })
	before?: string
}

@ObjectType('PageInfo')
abstract class GQLPageInfo implements PageInfo {
	@Field(() => String, { nullable: true })
	startCursor!: string | null

	@Field(() => String, { nullable: true })
	endCursor!: string

	@Field(() => Boolean)
	hasNextPage!: boolean

	@Field(() => Boolean)
	hasPrevPage!: boolean
}

export function createConnectionType<T extends Type<unknown>>(classRef: T, objectName = classRef.name) {
	@ObjectType(`${objectName}Edge`)
	abstract class EdgeType implements GQLEdge<T> {
		@Field(() => String, { nullable: true })
		cursor!: string

		@Field(() => classRef)
		node!: T
	}

	@ObjectType(`${objectName}Connection`)
	abstract class ConnectionType implements GQLConnection<T> {
		@Field(() => Int, {
			description: '[WARNING] For performance, do not include this field. Count records matching filters'
		})
		totalCount!: number

		@Field(() => [EdgeType])
		edges!: EdgeType[]

		@Field(() => GQLPageInfo)
		pageInfo!: GQLPageInfo
	}

	return ConnectionType
}
