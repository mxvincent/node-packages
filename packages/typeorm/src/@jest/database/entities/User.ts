import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractResource, dateTransformer, setPrimaryKeyColumns } from '../../../index'
import { dateType } from '../config'

@Entity({ name: 'User' })
export class User extends AbstractResource<User> {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'text' })
	name!: string

	@CreateDateColumn({ type: dateType, precision: 3, transformer: dateTransformer })
	createdAt!: Date
}

setPrimaryKeyColumns(User, ['id'])
