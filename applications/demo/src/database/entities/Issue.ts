import { Resource } from '@mxvincent/typeorm'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Project } from './Project'
import { User } from './User'

@Entity({ name: 'Issue' })
export class Issue extends Resource<Issue> {
	@Column({ type: 'text', nullable: true })
	name?: string

	@Column({ type: 'jsonb', nullable: true })
	description?: Record<string, unknown>

	@Column({ type: 'uuid' })
	userId!: string

	@ManyToOne(() => User, (user) => user.issues)
	user!: User

	@Column({ type: 'uuid' })
	projectId!: string

	@ManyToOne(() => Project, (project) => project.issues)
	project!: Project
}
