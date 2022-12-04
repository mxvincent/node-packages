import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractResource } from '../../../entities/AbstractResource'
import { setPrimaryKeyColumns } from '../../../sort/primaryKey'
import { dateTransformer } from '../../../transformers/dateTransformer'
import { dateType } from '../config'

@Entity({ name: 'DateContainer' })
export class DateContainer extends AbstractResource<DateContainer> {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Column({ type: dateType, precision: 3, nullable: true, transformer: dateTransformer })
	a!: Date

	@Column({ type: dateType, precision: 3, nullable: true, transformer: dateTransformer })
	b!: Date | null
}

setPrimaryKeyColumns(DateContainer, ['id'])
