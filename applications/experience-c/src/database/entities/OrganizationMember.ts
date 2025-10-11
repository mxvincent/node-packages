import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from '@mxvincent/typeorm'
import { Organization } from './Organization'
import { User } from './User'

export const organizationMemberRoles = ['admin', 'developer', 'owner'] as const
export type OrganizationMemberRole = (typeof organizationMemberRoles)[number]

export type OrganizationMemberUniqueProperties = Pick<OrganizationMember, 'organizationId' | 'userId'>

export type OrganizationMemberRelations = Pick<OrganizationMember, 'organization' | 'user'>

export type OrganizationMemberProperties = Omit<OrganizationMember, keyof OrganizationMemberRelations>

@Entity({ name: 'OrganizationMember' })
export class OrganizationMember {
	@PrimaryColumn({ type: 'uuid' })
	organizationId!: string

	@ManyToOne(() => Organization, (organization) => organization.members)
	@JoinColumn({ name: 'organizationId' })
	organization?: Relation<Organization>

	@PrimaryColumn({ type: 'uuid' })
	userId!: string

	@ManyToOne(() => User, (user) => user.organizations)
	@JoinColumn({ name: 'userId' })
	user?: Relation<User>

	@Column({ type: 'text' })
	role!: OrganizationMemberRole
}
