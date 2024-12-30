import { isString, NotFoundError } from '@mxvincent/core'
import { DataSource, FindOptionsWhere, ObjectLiteral, ObjectType } from 'typeorm'

export class ResourceNotFoundError extends NotFoundError {
	static fromWhereOptions<T extends ObjectLiteral>(
		dataSource: DataSource,
		entity: ObjectType<T>,
		where: FindOptionsWhere<T>
	) {
		const metadata = dataSource.getMetadata(entity)
		if ('id' in where && isString(where.id)) {
			throw ResourceNotFoundError.format(metadata.name, where.id)
		}
		const flattenedWhere = Array.isArray(where) ? where.flat(1) : where
		const parameters = Object.entries(flattenedWhere)
			.map(([key, value]) => `${key}=${value}`)
			.join(',')
		return new ResourceNotFoundError(`${metadata.name} not found (${parameters}).`)
	}

	static format(resourceType: string | ObjectType<unknown>, resourceId: string): ResourceNotFoundError {
		const resourceName = isString(resourceType) ? resourceType : resourceType.name
		return new ResourceNotFoundError(`${resourceName}:${resourceId} does not exists.`)
	}

	constructor(message = 'The requested resource does not exist.') {
		super(message)
	}
}
