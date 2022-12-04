import { createSortValidator } from './createSortValidator'

test('should return a function', async () => {
	expect(createSortValidator(['a.path'])).toBeInstanceOf(Function)
})
