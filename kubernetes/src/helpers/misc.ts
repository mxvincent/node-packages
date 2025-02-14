import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import * as process from 'process'
import { identity, memoizeWith } from 'ramda'

export type RequiredProperties<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }

export type Options<T, K extends keyof T> = { [P in K]-?: T[P] } & Partial<Omit<T, K>>

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>
		}
	: T

export const recursiveDirname = (iteration: number, path: string): string => {
	if (iteration === 0) {
		return path
	}
	return recursiveDirname(iteration - 1, dirname(path))
}

export const withProtocol = (protocol: 'http' | 'https') => (url: string) => `${protocol}://${url}`

export const http = withProtocol('http')
export const https = withProtocol('https')

export const env = (variableName: string, defaultValue?: string) => {
	return process.env[variableName] ?? defaultValue
}

export declare abstract class PlainObject {}
export type ClassConstructor<T> = {
	new (): T
}

/**
 * Transform literal object to an instance of a given class
 */
export function hydrate<T extends PlainObject>(Constructor: ClassConstructor<T>, values: T): T {
	return Object.assign(new Constructor(), values)
}

/**
 * Get applications directory path
 */
export const getApplicationDirectory = memoizeWith(identity, (path: string): string => {
	if (path === '/') {
		throw new Error('Failed to find repository root dir')
	}
	if (existsSync(`${path}/pnpm-workspace.yaml`)) {
		return `${path}/applications`
	}
	return getApplicationDirectory(dirname(path))
})

/**
 * Find or create value in a weak map
 * @param values
 * @param key
 * @param createValue
 */
export const weakMapFindOfCreate = <K extends WeakKey, V>(values: WeakMap<K, V>, key: K, createValue: () => V): V => {
	{
		const value = values.get(key)
		if (value) {
			return value
		}
	}
	{
		const value = createValue()
		values.set(key, value)
		return value
	}
}
