export interface ResourceInterface {
	id: string
	createdAt: Date
	updatedAt: Date
}

export interface DeletableResourceInterface extends ResourceInterface {
	deletedAt: Date
}
