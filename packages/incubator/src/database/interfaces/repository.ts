import { KeyOf, ObjectLiteral } from '@mxvincent/core'
import { ComparisonFilter, ListQueryParameter, Page } from '@mxvincent/query-params'

export interface RepositoryGetPage<TEntity extends ObjectLiteral> {
	getPage(parameters: ListQueryParameter<TEntity>): Promise<Page<TEntity>>
}
export interface RepositoryFindOne<TEntity extends ObjectLiteral> {
	findOne(filters: ComparisonFilter<KeyOf<TEntity>>[]): Promise<TEntity | null>
}

export interface RepositoryFindMany<TEntity extends ObjectLiteral> {
	findMany(options: Omit<ListQueryParameter<TEntity>, 'pagination'>): Promise<TEntity[]>
}

export interface RepositoryCreate<TEntity extends ObjectLiteral, TCreate = Partial<TEntity>> {
	create(values: TCreate): Promise<TEntity>
}

export interface RepositoryUpdate<TEntity extends ObjectLiteral, TUpdate = Partial<TEntity>> {
	update(entity: TEntity, values: TUpdate): Promise<TEntity>
}

export interface RepositoryDelete<TEntity extends ObjectLiteral> {
	delete(entity: TEntity): Promise<TEntity>
}

export interface ReadRepository<TEntity extends ObjectLiteral>
	extends RepositoryFindOne<TEntity>,
		RepositoryFindMany<TEntity> {}

export interface Repository<TEntity extends ObjectLiteral, TCreate = Partial<TEntity>, TUpdate = Partial<TEntity>>
	extends ReadRepository<TEntity>,
		RepositoryCreate<TEntity, TCreate>,
		RepositoryUpdate<TEntity, TUpdate>,
		RepositoryDelete<TEntity> {}
