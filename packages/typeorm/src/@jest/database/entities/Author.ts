import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractResource, dateTransformer, setPrimaryKeyColumns } from '../../../index'
import { dateType } from '../config'
import { Post } from './Post'

export type Gender = 'female' | 'male' | 'unknown'

@Entity({ name: 'Author' })
export class Author extends AbstractResource<Author> {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'text' })
	name!: string

	@CreateDateColumn({ type: dateType, precision: 3, transformer: dateTransformer })
	createdAt!: Date

	@Column({ type: 'text', default: 'unknown' })
	gender!: Gender

	@Column({ type: 'int', nullable: true })
	age!: number

	@OneToMany(() => Post, (post) => post.author, { cascade: ['insert'] })
	posts!: Post[]
}

setPrimaryKeyColumns(Author, ['id'])
