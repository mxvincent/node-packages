export type ObjectConstructor<T> = {
	new (): T
}

export class ObjectLiteral {}

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P]
}

export type MutableProperties<T, K extends keyof T> = {
	-readonly [P in K]: T[P]
} & Omit<T, K>
