import { User } from '#/database/entities/User'
import { faker } from '@faker-js/faker'
import { deletableResourceFactory, hydrate } from '@mxvincent/typeorm'

export const nameAttributes = ({ firstName, lastName }: Partial<User> = {}): Pick<User, 'firstName' | 'lastName'> => {
	const gender = faker.person.sex() as 'female' | 'male'
	return {
		firstName: firstName ?? faker.person.firstName(gender),
		lastName: lastName ?? faker.person.lastName(gender)
	}
}

export const userFactory = (options: Partial<User> = {}): User => {
	const resourceAttributes = deletableResourceFactory(options)
	return hydrate(User, {
		...resourceAttributes,
		...nameAttributes(options),
		email: options.email ?? resourceAttributes.id + '@domain.tld',
		username: options.username ?? 'User:' + resourceAttributes.id
	})
}
