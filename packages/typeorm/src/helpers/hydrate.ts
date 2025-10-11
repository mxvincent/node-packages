import { ObjectLiteral } from 'typeorm'

export type ClassConstructor<T> = {
	new (): T
}

/**
 * Transform literal object to an instance of a given class
 */
export function hydrate<T extends ObjectLiteral>(Constructor: ClassConstructor<T>, values: T): T {
	return Object.assign(new Constructor(), values)
}

/**
 * Transform literal object to a partial instance of a given class
 */
export function hydratePartial<T extends ObjectLiteral>(
	Constructor: ClassConstructor<T>,
	values: Partial<T>
): Partial<T> {
	return Object.assign(new Constructor(), values)
}
