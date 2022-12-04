import { ResourceSchema } from '@mxvincent/json-schema'
import { Type } from '@sinclair/typebox'
import { OrganizationMemberSchema } from './OrganizationMemberSchema'

export const OrganizationSchema = () => {
	return ResourceSchema({ name: Type.String() }, { $id: 'Organization' })
}

export const OrganizationWithMembersSchema = () =>
	Type.Intersect([
		OrganizationSchema(),
		Type.Object({
			members: Type.Array(Type.Pick(OrganizationMemberSchema(), ['user', 'role']))
		})
	])
