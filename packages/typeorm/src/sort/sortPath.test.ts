import { User } from '../@jest/database'
import { defaultSort, getDefaultSort, setDefaultSort } from './sortPath'

beforeEach(() => {
	defaultSort.delete(User)
})

describe('set default sort', () => {
	test('should set map entry', () => {
		setDefaultSort(User, [{ direction: 'desc', path: 'createdAt' }])
		expect(defaultSort.get(User)).toEqual([{ direction: 'desc', path: 'createdAt' }])
	})
})

describe('get default sort', () => {
	test('should return custom sort options', () => {
		defaultSort.set(User, [{ direction: 'desc', path: 'createdAt' }])
		expect(getDefaultSort(User)).toEqual([{ direction: 'desc', path: 'createdAt' }])
	})
	test('should return empty array as default', () => {
		expect(getDefaultSort(User)).toEqual([])
	})
})
