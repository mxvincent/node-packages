import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { timestampWithTimeZone } from '../../../helpers/entities'

@Entity({ name: 'DateContainer' })
export class DateContainer {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column(timestampWithTimeZone({ nullable: true }))
	a!: Date

	@Column(timestampWithTimeZone({ nullable: true }))
	b!: Date | null
}
