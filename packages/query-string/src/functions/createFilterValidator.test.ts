import { createFilterValidator } from './createFilterValidator'

test('should return a function', async () => {
	expect(createFilterValidator(['a.path'])).toBeInstanceOf(Function)
})
