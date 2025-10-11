import { KeyOf } from '@mxvincent/core'
import { Sort } from '@mxvincent/query-params'
import { Author } from '../@jest/database'
import { defaultSort, getAliasedPath, getDefaultSort, mergePrimaryKeySorts, setDefaultSort } from './sortPath'

beforeEach(() => {
	defaultSort.delete(Author)
})

describe('set default sort', () => {
	test('should set map entry', () => {
		setDefaultSort(Author, [Sort.desc('createdAt')])
		expect(defaultSort.get(Author)).toEqual([Sort.desc('createdAt')])
	})
})

describe('get default sort', () => {
	test('should return custom sort options', () => {
		defaultSort.set(Author, [Sort.desc('createdAt')])
		expect(getDefaultSort(Author)).toEqual([Sort.desc('createdAt')])
	})
	test('should return empty array as default', () => {
		expect(getDefaultSort(Author)).toEqual([])
	})
})

describe('getAliasedPath()', () => {
	test('should add the alias at the beginning when path only contains a field', async () => {
		expect(getAliasedPath('test', 'alias')).toBe('alias.test')
	})
	test('should not add alias when path contains nested fields', async () => {
		expect(getAliasedPath('other.test', 'alias')).toBe('other.test')
	})
})

describe('appendPrimaryKeySorts()', () => {
	type Pet = {
		id: string
		name: string
	}

	test('should fail when `primaryKeyColumns` array is empty', () => {
		const sorts: Sort<KeyOf<Pet>>[] = []
		expect(() => mergePrimaryKeySorts(sorts, [] as never)).toThrowError(
			'Invariant failed: Argument primaryKeyColumns should be a non empty array'
		)
	})

	test('should append primary key sort', async () => {
		const sorts: Sort<KeyOf<Pet>>[] = []
		expect(mergePrimaryKeySorts(sorts, ['id'])).toStrictEqual([Sort.asc('id')])
	})

	test('should not override primary key sort', async () => {
		const sorts: Sort<KeyOf<Pet>>[] = [Sort.asc('id')]
		expect(mergePrimaryKeySorts(sorts, ['id'])).toStrictEqual([Sort.asc('id')])
	})

	test('should not mutation sorts argument', async () => {
		const sorts: Sort<KeyOf<Pet>>[] = []
		mergePrimaryKeySorts(sorts, ['id'])
		expect(sorts).toEqual([])
	})
})
