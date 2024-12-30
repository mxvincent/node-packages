import { createEmptyGQLConnection, createEmptyPage } from './factories'

test('should return empty pagination result (REST)', () => {
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

test('should return empty pagination result (GraphQL)', () => {
	expect(createEmptyGQLConnection()).toEqual({
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
