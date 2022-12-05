import { faker } from '@faker-js/faker'
import { User } from '../entities/User'
import { createResource } from './helpers/resource'

export const createUser = (options: Partial<User>): User => {
	const gender = faker.name.sex() as 'female' | 'male'
	const firstName = faker.name.firstName(gender)
	const lastName = faker.name.lastName(gender)
	return new User({
		...createResource(options),
		firstName,
		lastName,
		email: faker.internet.email(firstName, lastName),
		username: faker.internet.userName(firstName, lastName)
	})
}
