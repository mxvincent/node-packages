import { arrayComparisonFilter, logicalFilter, nullComparisonFilter, valueComparisonFilter } from './factories'
import {
	ArrayComparisonOperator,
	ComparisonOperator,
	LogicalOperator,
	NullComparisonOperator,
	ValueComparisonOperator
} from './operators'

export enum FilterType {
	COMPARISON = 'COMPARISON',
	LOGICAL = 'LOGICAL'
}

export abstract class ComparisonFilter<T extends string = string> {
	readonly type = FilterType.COMPARISON
	readonly operator: ComparisonOperator
	readonly path: T

	/**
	 * Value comparison filters
	 */
	static equal = valueComparisonFilter(ComparisonOperator.EQUAL)
	static notEqual = valueComparisonFilter(ComparisonOperator.NOT_EQUAL)
	static lessThan = valueComparisonFilter(ComparisonOperator.LESS_THAN)
	static lessThanOrEqual = valueComparisonFilter(ComparisonOperator.LESS_THAN_OR_EQUAL)
	static greaterThan = valueComparisonFilter(ComparisonOperator.GREATER_THAN)
	static greaterThanOrEqual = valueComparisonFilter(ComparisonOperator.GREATER_THAN_OR_EQUAL)
	static like = valueComparisonFilter(ComparisonOperator.LIKE)
	static notLike = valueComparisonFilter(ComparisonOperator.NOT_LIKE)
	static match = valueComparisonFilter(ComparisonOperator.MATCH)
	static insensitiveMatch = valueComparisonFilter(ComparisonOperator.INSENSITIVE_MATCH)

	/**
	 * Null comparison filters
	 */
	static null = nullComparisonFilter(ComparisonOperator.NULL)
	static notNull = nullComparisonFilter(ComparisonOperator.NOT_NULL)

	/**
	 * Array comparison filters
	 */
	static in = arrayComparisonFilter(ComparisonOperator.IN)
	static notIn = arrayComparisonFilter(ComparisonOperator.NOT_IN)

	protected constructor(operator: ComparisonFilter['operator'], path: T) {
		this.operator = operator
		this.path = path
	}
}

export class LogicalFilter<T extends string = string> {
	readonly type = FilterType.LOGICAL
	readonly operator: LogicalOperator
	readonly filters: Filter<T>[]

	/**
	 * Logical filters
	 */
	static and = logicalFilter(LogicalOperator.AND)
	static or = logicalFilter(LogicalOperator.OR)

	constructor(operator: LogicalOperator, filters: Filter<T>[]) {
		this.operator = operator
		this.filters = filters
	}
}

export class ArrayComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: ArrayComparisonOperator
	declare readonly values: string[]

	constructor(operator: ArrayComparisonOperator, path: T, values: string[]) {
		super(operator, path)
		this.values = values
	}
}

export class NullComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: NullComparisonOperator

	constructor(operator: NullComparisonOperator, path: T) {
		super(operator, path)
	}
}

export class ValueComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: ValueComparisonOperator
	declare readonly value: string

	constructor(operator: ValueComparisonOperator, path: T, value: string) {
		super(operator, path)
		this.value = value
	}
}

export type Filter<T extends string = string> = ComparisonFilter<T> | LogicalFilter<T>
