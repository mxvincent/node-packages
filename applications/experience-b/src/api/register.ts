import { getOrganization } from '#/api/organizations/get-organization'
import { listOrganizations } from '#/api/organizations/list-organizations'
import plugin from 'fastify-plugin'

export const api = plugin(async (app) => {
	app.get('/', () => ({ status: 'OK' }))
	app.get('/organizations', listOrganizations)
	app.get('/organizations/:id', getOrganization)
})
