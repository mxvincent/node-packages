import { Equal, Or } from '../filters'
import { removeDuplicatedFilters } from './removeDuplicatedFilters'

test('should remove duplicated filters', async () => {
	const filter = Equal('a', 'a')
	expect(removeDuplicatedFilters([filter, filter])).toEqual([filter])
})

test('should handle nested filters', async () => {
	const filter = Equal('a', 'a')
	expect(removeDuplicatedFilters([filter, Or(filter, filter)])).toEqual([filter, Or(filter)])
})
