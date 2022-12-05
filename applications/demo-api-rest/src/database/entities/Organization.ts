import { Resource } from '@mxvincent/typeorm'
import { Column, Entity, OneToMany } from 'typeorm'
import { OrganizationMember } from './OrganizationMember'
import { Project } from './Project'

@Entity({ name: 'Organization' })
export class Organization extends Resource<Organization> {
	@Column({ type: 'text' })
	name!: string

	@OneToMany(() => Project, (project) => project.organization)
	projects!: Project[]

	@OneToMany(() => OrganizationMember, (organisationMember) => organisationMember.organization)
	members!: OrganizationMember[]
}
