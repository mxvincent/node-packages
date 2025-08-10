import { faker } from '@faker-js/faker'
import { generateUUID } from '@mxvincent/core'

export const generateResource = () => {
	const now = faker.date.between({ from: new Date('2020-01-01T00:00:00Z'), to: new Date() }).toISOString()
	return {
		id: generateUUID(7),
		createdAt: now,
		updatedAt: now
	}
}

export const generateIso8601 = () => new Date().toISOString()
