import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Author } from './Author'

@Entity({ name: 'Post' })
export class Post {
	@PrimaryGeneratedColumn('increment')
	id!: number

	@Column({ type: 'text', nullable: true })
	name: string | null = null

	@Column('uuid')
	authorId!: string

	@ManyToOne(() => Author, (user) => user.posts)
	author?: Author
}
