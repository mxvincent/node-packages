import { Column, DeletableResource, Entity, OneToMany, Relation } from '@mxvincent/typeorm'
import { OrganizationMember } from './OrganizationMember'

export type OrganizationRelations = Pick<Organization, 'members'>

export type OrganizationAttributes = Omit<Organization, keyof OrganizationRelations>

export type OrganizationUniqueProperties = Pick<Organization, 'id'> | Pick<Organization, 'name'>

@Entity({ name: 'Organization' })
export class Organization extends DeletableResource {
	@Column({ type: 'text' })
	name!: string

	@OneToMany(() => OrganizationMember, (organisationMember) => organisationMember.organization)
	members?: Relation<OrganizationMember>[]
}
