import { Resource } from '@mxvincent/typeorm'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Issue } from './Issue'
import { Organization } from './Organization'

@Entity({ name: 'Project' })
export class Project extends Resource<Project> {
	@Column({ type: 'text' })
	name!: string

	@Column({ type: 'uuid' })
	organizationId!: string

	@ManyToOne(() => Organization, (organization) => organization.projects)
	organization!: Organization

	@OneToMany(() => Issue, (issue) => issue.project)
	issues!: string
}
