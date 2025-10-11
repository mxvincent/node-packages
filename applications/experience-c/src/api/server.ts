import { contextManager } from '#/core/context'
import { listOrganizations } from '#/functions/list-organizations'
import { registerOrganizations } from '#/functions/register-organization'
import { ApolloServer } from '@apollo/server'

const typeDefs = `#graphql
type Organization {
	name: String
}

type Query {
	organizations: [Organization]
}

type Mutation {
	registerOrganizations(itemsCount: Int!): [Organization]
}
`

const resolvers = {
	Query: {
		organizations: contextManager.wrap(listOrganizations)
	},
	Mutation: {
		registerOrganizations: contextManager.wrap(registerOrganizations)
	}
}

export const server = new ApolloServer({
	typeDefs,
	resolvers
})
