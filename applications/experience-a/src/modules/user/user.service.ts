import { Database } from '#/database/database.service'
import { User, UserProperties, UserUniqueProperties } from '#/database/entities/User'
import { ConflictError } from '@mxvincent/core'
import { GQLConnection, ListQueryParameter } from '@mxvincent/query-params'
import { DeletableResource, Not } from '@mxvincent/typeorm'
import { Injectable } from '@nestjs/common'

export type CreateUserPayload = Omit<UserProperties, keyof DeletableResource>
export type UpdateUserPayload = Partial<CreateUserPayload>

@Injectable()
export class UserService {
	constructor(protected database: Database) {
		this.database = database
	}

	async getConnection(options: ListQueryParameter): Promise<GQLConnection<User>> {
		const repository = this.database.repository(User)
		return repository.getConnection(options)
	}

	async findOne(where: UserUniqueProperties): Promise<User | null> {
		const repository = this.database.repository(User)
		return repository.findOne(where)
	}

	async findOneOrFail(where: UserUniqueProperties): Promise<User> {
		const repository = this.database.repository(User)
		return repository.findOneOrFail(where)
	}

	async create(payload: CreateUserPayload): Promise<User> {
		const repository = this.database.repository(User)
		if (await repository.findOne({ email: payload.email })) {
			throw new ConflictError(`Email already taken.`)
		}
		if (await repository.findOne({ username: payload.username })) {
			throw new ConflictError(`Username already taken.`)
		}
		return repository.create(payload)
	}

	async update(where: UserUniqueProperties, payload: UpdateUserPayload): Promise<User> {
		const repository = this.database.repository(User)
		const user = await repository.findOneOrFail(where)
		const { email, username } = payload
		if (email && email !== user.email && (await repository.findOne({ email, id: Not(user.id) }))) {
			throw new ConflictError(`Email already taken.`)
		}
		if (username && username !== user.username && (await repository.findOne({ username, id: Not(user.id) }))) {
			throw new ConflictError(`Username already taken.`)
		}
		return repository.update(user, payload)
	}

	async delete(where: UserUniqueProperties): Promise<User> {
		const repository = this.database.repository(User)
		const user = await repository.findOneOrFail(where)
		return repository.delete(user)
	}
}
