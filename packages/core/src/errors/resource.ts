import { BaseError } from './base'

export abstract class ResourceError extends BaseError {}

export class ResourceNotFoundError extends ResourceError {
	code = 'RESOURCE_NOT_FOUND'
	resourceType: string
	resourceId: string

	constructor(resourceType: string, resourceId: string) {
		super()
		this.resourceType = resourceType
		this.resourceId = resourceId
		this.message = `Resource ${resourceType} with id ${resourceId} not found.`
	}
}
