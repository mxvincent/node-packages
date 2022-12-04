import { getEmptyPaginationResult } from './getEmptyPaginationResult'

test('should return empty pagination result', async () => {
	expect(getEmptyPaginationResult()).toEqual({
		data: [],
		totalCount: 0,
		hasPrevPage: false,
		hasNextPage: false,
		startCursor: null,
		endCursor: null
	})
})
