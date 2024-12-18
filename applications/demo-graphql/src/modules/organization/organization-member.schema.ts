import { GQLUser } from '@app/modules/user/user.schema'
import { GQLConflictError, GQLNotFoundError } from '@app/schemas/errors.schema'
import { createConnectionType } from '@app/schemas/pagination.schema'
import { UUID } from '@app/schemas/scalars.schema'
import {
	OrganizationMember,
	OrganizationMemberRole,
	organizationMemberRoles
} from '@database/entities/OrganizationMember'
import { createUnionType, Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GQLOrganization } from './organization.schema'

const GQLOrganizationMemberRole = Object.fromEntries(organizationMemberRoles.map((role) => [role, role]))
registerEnumType(GQLOrganizationMemberRole, { name: 'OrganizationMemberRole' })

@ObjectType('OrganizationMember')
export class GQLOrganizationMember {
	@Field(() => GQLOrganization)
	organization!: GQLOrganization

	@Field(() => GQLOrganizationMemberRole)
	role!: OrganizationMemberRole

	@Field(() => GQLUser)
	user!: GQLUser
}

export const GQLOrganizationMemberConnection = createConnectionType(GQLOrganizationMember, 'OrganizationMember')

export const GQLAddOrganizationMemberResult = createUnionType({
	name: 'AddOrganizationMemberResult',
	types: () => [GQLOrganizationMember, GQLConflictError, GQLNotFoundError] as const,
	resolveType(value) {
		if (value instanceof OrganizationMember) {
			return GQLOrganizationMember
		}
		return value.constructor
	}
})

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class GQLOrganizationMemberWhere {
	@Field(() => UUID)
	organizationId!: string

	@Field(() => UUID)
	userId!: string
}

@InputType({ isAbstract: true })
export class GQLAddOrganizationMemberInput extends GQLOrganizationMemberWhere {
	@Field(() => GQLOrganizationMemberRole)
	role!: OrganizationMemberRole
}

@ObjectType({ isAbstract: true })
export class GQLRemoveOrganizationMemberResult extends GQLOrganizationMemberWhere {}
