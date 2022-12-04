import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractResource, setPrimaryKeyColumns } from '../../../index'
import { Author } from './Author'

@Entity({ name: 'Post' })
export class Post extends AbstractResource<Post> {
	@PrimaryGeneratedColumn('increment')
	id!: number

	@Column({ type: 'text', nullable: true })
	name!: string | null

	@Column('uuid', { nullable: true })
	userId!: string

	@ManyToOne(() => Author, (user) => user.posts, { nullable: true })
	author!: Author
}

setPrimaryKeyColumns(Post, ['id'])
