import { mapSortOptions } from './mapSortOptions'

test('should map sort options', async () => {
	expect(mapSortOptions({ direction: 'asc', path: 'a.path' })).toEqual({ direction: 'asc', paths: ['a.path'] })
})

test('should handle undefined', async () => {
	expect(mapSortOptions()).toBeUndefined()
})
