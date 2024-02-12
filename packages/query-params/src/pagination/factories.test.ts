import { createEmptyConnection, createEmptyPage } from './factories'

test('should return empty pagination result', () => {
	expect(createEmptyPage()).toEqual({
		data: [],
		totalCount: 0,
		pageInfo: {
			hasPrevPage: false,
			hasNextPage: false,
			startCursor: null,
			endCursor: null
		}
	})
})

test('should return empty pagination result', () => {
	expect(createEmptyConnection()).toEqual({
		edges: [],
		totalCount: 0,
		pageInfo: {
			hasPrevPage: false,
			hasNextPage: false,
			startCursor: null,
			endCursor: null
		}
	})
})
