import { isString, NotFoundError, Resource } from '@mxvincent/core'
import { DataSource, FindOptionsWhere, ObjectType } from 'typeorm'

export class TypeormResourceNotFoundError extends NotFoundError {
	constructor(message = 'The requested resource does not exist.') {
		super(message)
	}

	static fromWhereOptions<T extends Resource>(
		dataSource: DataSource,
		entity: ObjectType<T>,
		where: Partial<T> | FindOptionsWhere<T>
	) {
		const metadata = dataSource.getMetadata(entity)
		if ('id' in where && isString(where.id)) {
			throw TypeormResourceNotFoundError.format(metadata.name, where.id)
		}
		const flattenedWhere = Array.isArray(where) ? where.flat(1) : where
		const parameters = Object.entries(flattenedWhere)
			.map(([key, value]) => `${key}=${value}`)
			.join(',')
		return new TypeormResourceNotFoundError(`${metadata.name} not found (${parameters}).`)
	}

	static format(resourceType: string | ObjectType<unknown>, resourceId: string): TypeormResourceNotFoundError {
		const resourceName = isString(resourceType) ? resourceType : resourceType.name
		return new TypeormResourceNotFoundError(`${resourceName}:${resourceId} does not exists.`)
	}
}
