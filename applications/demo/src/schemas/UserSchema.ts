import { ResourceSchema } from '@mxvincent/json-schema'
import { Type } from '@sinclair/typebox'
import { OrganizationMemberSchema } from './OrganizationMemberSchema'

export const UserSchema = () => {
	return ResourceSchema(
		{
			email: Type.String({ format: 'email' }),
			username: Type.String(),
			firstName: Type.String(),
			lastName: Type.String()
		},
		{
			$id: 'User'
		}
	)
}

export const UserOrganizationsSchema = () => {
	return Type.Object({
		organizations: Type.Array(Type.Pick(OrganizationMemberSchema(), ['organization', 'role']))
	})
}

export const UserWithOrganizationsSchema = () => Type.Intersect([UserSchema(), UserOrganizationsSchema()])
