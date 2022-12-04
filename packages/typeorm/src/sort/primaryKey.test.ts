import { User } from '../@jest/database'
import { getPrimaryKeyColumns, primaryKeys, setPrimaryKeyColumns } from './primaryKey'

beforeEach(() => {
	primaryKeys.delete(User)
})

describe('set sortable paths', () => {
	test('should set map entry', () => {
		setPrimaryKeyColumns(User, ['id'])
		expect(primaryKeys.get(User)).toEqual(['id'])
	})
})

describe('get primary key', () => {
	test('should return primary key', () => {
		primaryKeys.set(User, ['id'])
		expect(getPrimaryKeyColumns(User)).toEqual(['id'])
	})
	test('should throw an error if key is not configured', () => {
		expect(() => getPrimaryKeyColumns(User)).toThrowError(`primary key is not configured for User`)
	})
})
