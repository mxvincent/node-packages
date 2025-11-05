export interface ResourceId {
	id: string | number
}

export interface ResourceCreatedAt {
	createdAt: Date
}

export interface ResourceUpdatedAt {
	updatedAt: Date
}

export interface ResourceDeletedAt {
	deletedAt: Date | null
}

export abstract class Resource implements ResourceId {
	declare id: string | number
}

export abstract class TimestampedResource extends Resource implements ResourceCreatedAt, ResourceUpdatedAt {
	declare id: string
	declare createdAt: Date
	declare updatedAt: Date
}

export abstract class SoftDeletableResource extends TimestampedResource implements ResourceDeletedAt {
	declare deletedAt: Date | null
}
