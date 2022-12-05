import { AbstractResource } from '@mxvincent/typeorm'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Organization } from './Organization'
import { User } from './User'

export const organizationRoles = ['admin', 'developer', 'owner'] as const
export type OrganizationRole = typeof organizationRoles[number]

@Entity({ name: 'OrganizationMember' })
export class OrganizationMember extends AbstractResource<OrganizationMember> {
	@PrimaryColumn({ type: 'uuid' })
	organizationId!: string

	@ManyToOne(() => Organization, (organization) => organization.members)
	@JoinColumn({ name: 'organizationId' })
	organization!: Organization

	@PrimaryColumn({ type: 'uuid' })
	userId!: string

	@ManyToOne(() => User, (user) => user.organizations)
	@JoinColumn({ name: 'userId' })
	user!: User

	@Column({ type: 'text', enum: organizationRoles })
	role!: OrganizationRole
}
