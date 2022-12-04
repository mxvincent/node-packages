import { DeleteDateColumn } from 'typeorm'
import { Resource } from './Resource'

/**
 * Abstract type for soft deletable resources
 */
export abstract class SoftDeletableResource<T> extends Resource<T> {
	/**
	 * Soft delete timestamp
	 */
	@DeleteDateColumn({ type: 'timestamp with time zone', precision: 3 })
	deletedAt!: Date
}
