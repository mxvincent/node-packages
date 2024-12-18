import { Column, DeletableResource, Entity, OneToMany, Relation } from '@mxvincent/typeorm'
import { OrganizationMember } from './OrganizationMember'

export type UserUniqueProperties = Pick<User, 'id'> | Pick<User, 'email'> | Pick<User, 'username'>

export type UserRelations = Pick<User, 'organizations'>

export type UserProperties = Omit<User, keyof UserRelations>

@Entity({ name: 'User' })
export class User extends DeletableResource {
	@Column({ type: 'text', unique: true })
	email!: string

	@Column({ type: 'text', unique: true })
	username!: string

	@Column({ type: 'text' })
	firstName!: string

	@Column({ type: 'text' })
	lastName!: string

	@OneToMany(() => OrganizationMember, (organizationMember) => organizationMember.user, { onDelete: undefined })
	organizations?: Relation<OrganizationMember>[]
}
