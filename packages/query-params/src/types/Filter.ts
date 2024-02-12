import {
	ArrayComparisonOperator,
	ComparisonOperator,
	LogicalOperator,
	NullComparisonOperator,
	ValueComparisonOperator
} from './FilterOperator'

export class ComparisonFilter<T extends string = string> {
	readonly operator: ComparisonOperator
	readonly path: T
	readonly type = 'comparison'
	readonly value: string | string[] | null

	protected constructor(operator: ComparisonFilter['operator'], path: T, value: ComparisonFilter['value']) {
		this.operator = operator
		this.path = path
		this.value = value
	}
}

export class ArrayComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: ArrayComparisonOperator
	declare readonly value: string[]

	constructor(operator: ArrayComparisonOperator, path: T, value: string[]) {
		super(operator, path, value)
	}
}

export class NullComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: NullComparisonOperator
	declare readonly value: null

	constructor(operator: NullComparisonOperator, path: T) {
		super(operator, path, null)
	}
}

export class ValueComparisonFilter<T extends string = string> extends ComparisonFilter<T> {
	declare readonly operator: ValueComparisonOperator
	declare readonly value: string

	constructor(operator: ValueComparisonOperator, path: T, value: string) {
		super(operator, path, value)
	}
}

export class LogicalFilter {
	// readonly depth = 1
	readonly type = 'logical'
	readonly operator: LogicalOperator
	readonly filters: Array<LogicalFilter | ComparisonFilter>

	constructor(operator: LogicalOperator, filters: LogicalFilter['filters']) {
		// this.depth = filters.filter(isLogicalFilter).reduce(filter => filter.d)
		this.operator = operator
		this.filters = filters
	}
}

export type Filter = ComparisonFilter | LogicalFilter
