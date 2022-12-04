import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { AbstractResource } from './AbstractResource'

/**
 * Abstract type for basic entities with createdAt and updatedAt timestamps
 */
export abstract class Resource<T> extends AbstractResource<T> {
	/**
	 * UUID v4 used as primary key
	 */
	@PrimaryGeneratedColumn('uuid')
	id!: string

	/**
	 * Creation timestamp
	 */
	@CreateDateColumn({ type: 'timestamp with time zone', precision: 3 })
	createdAt!: Date

	/**
	 * Last update timestamp
	 */
	@UpdateDateColumn({ type: 'timestamp with time zone', precision: 3 })
	updatedAt!: Date
}
