import { markdownDescription } from '@mxvincent/query-string'
import { Static, Type } from '@sinclair/typebox'
import { FastifyRequest } from 'fastify'
import { RouteShorthandOptionsWithHandler } from 'fastify/types/route'
import { FastifySchema } from 'fastify/types/schema'
import { In } from 'typeorm'
import { database } from '../../database'
import { Organization } from '../../database/entities/Organization'
import { OrganizationMember } from '../../database/entities/OrganizationMember'
import { User } from '../../database/entities/User'
import { OrganizationMemberRoleSchema } from '../../schemas/OrganizationMemberSchema'
import { UserWithOrganizationsSchema } from '../../schemas/UserSchema'

const CreateUserSchema = Type.Object({
	email: Type.String({ format: 'email' }),
	username: Type.String({ minLength: 3 }),
	firstName: Type.String({ minLength: 3 }),
	lastName: Type.String({ minLength: 3 }),
	organizations: Type.Array(
		Type.Object({
			id: Type.String({ format: 'uuid' }),
			role: OrganizationMemberRoleSchema()
		})
	)
})

const schema: FastifySchema = {
	description: markdownDescription({ header: 'Register user.' }),
	tags: ['User'],
	body: CreateUserSchema,
	response: {
		200: UserWithOrganizationsSchema()
	}
}

const handler = async (request: FastifyRequest<{ Body: Static<typeof CreateUserSchema> }>): Promise<User> => {
	return await database.transaction(async (entityManager) => {
		const user = await entityManager.save(
			new User({
				email: request.body.email,
				username: request.body.username,
				firstName: request.body.firstName,
				lastName: request.body.lastName
			})
		)
		const organizations = await entityManager.findBy(Organization, {
			id: In(request.body.organizations.map((organization) => organization.id))
		})
		user.organizations = await entityManager.save(
			request.body.organizations.map(
				({ id, role }) => new OrganizationMember({ organizationId: id, userId: user.id, role })
			)
		)
		user.organizations.forEach((organizationMember) => {
			organizationMember.organization = organizations.find(
				(organization) => organization.id === organizationMember.organizationId
			) as Organization
		})
		return user
	})
}

export default { handler, schema } as RouteShorthandOptionsWithHandler
