import { Author } from '../@jest/database'
import { getPrimaryKeyColumns, primaryKeys, setPrimaryKeyColumns } from './primary-key'

beforeEach(() => {
	primaryKeys.delete(Author)
})

describe('set sortable paths', () => {
	test('should set map entry', () => {
		setPrimaryKeyColumns(Author, ['id'])
		expect(primaryKeys.get(Author)).toEqual(['id'])
	})
})

describe('get primary key', () => {
	test('should return primary key', () => {
		primaryKeys.set(Author, ['id'])
		expect(getPrimaryKeyColumns(Author)).toEqual(['id'])
	})
	test('should throw an error if key is not configured', () => {
		expect(() => getPrimaryKeyColumns(Author)).toThrowError(`Primary key is not configured for Author`)
	})
})
