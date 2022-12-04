import { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import listOrganizations from './organizations/listOrganizations'
import createUser from './users/createUser'
import listUsers from './users/listUsers'

export const apiPlugin: FastifyPluginAsync = fastifyPlugin(async (app) => {
	/**
	 * User
	 */
	app.get('/users', listUsers)
	app.post('/users', createUser)
	/**
	 * Organization
	 */
	app.get('/organizations', listOrganizations)
})
