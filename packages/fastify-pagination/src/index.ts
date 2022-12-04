import { PaginationResult } from '@mxvincent/query'
import plugin from 'fastify-plugin'

declare module 'fastify' {
	interface FastifyReply {
		sendPage(input: PaginationResult<unknown>): void
		setPaginationHeaders(input: PaginationResult<unknown>): void
	}
}

export const fastifyPagination = plugin(
	async (instance) => {
		instance.decorateReply('setPaginationHeaders', function (page: PaginationResult<unknown>) {
			this.header('x-total-count', page.totalCount)
			this.header('x-has-prev-page', page.hasPrevPage)
			this.header('x-has-next-page', page.hasNextPage)
			if (page.startCursor) {
				this.header('x-start-cursor', page.startCursor)
			}
			if (page.endCursor) {
				this.header('x-end-cursor', page.endCursor)
			}
		})
		instance.decorateReply('sendPage', function (page: PaginationResult<unknown>) {
			this.setPaginationHeaders(page)
			this.send(page.data)
		})
	},
	{ fastify: '3.x || 4.x' }
)
