import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { timestampWithTimeZone } from '../../../helpers/entities'
import { Post } from './Post'

export type Gender = 'female' | 'male' | 'unknown'

@Entity({ name: 'Author' })
export class Author {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: 'text' })
	name!: string

	@CreateDateColumn(timestampWithTimeZone())
	createdAt!: Date

	@Column({ type: 'text', default: 'unknown' })
	gender!: Gender

	@Column({ type: 'int', nullable: true })
	age!: number

	@OneToMany(() => Post, (post) => post.author, { cascade: ['insert'] })
	posts?: Post[]
}
