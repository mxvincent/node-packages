import { randomUUID } from 'crypto'
import { range } from 'ramda'
import { Author, Gender } from './entities/Author'
import { DateContainer } from './entities/DateContainer'
import { User } from './entities/User'

const startingDate = new Date('2020-01-01T00:00:00Z')
const addSeconds = (date: Date, n: number): Date => new Date(date.getTime() + n * 1000)

export const getGender = (n: number): Gender => ['female', 'male', 'unknown'][n % 3] as Gender

export const createUsers = (n: number, dateStep = 1, useRandomIds = false): User[] => {
	return range(0, n <= 10 ** 12 ? n : 10 ** 12).map((i) => {
		const id = useRandomIds ? randomUUID() : `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`
		return new User({
			id,
			name: `user-${id.slice(-12)}`,
			createdAt: addSeconds(startingDate, Math.trunc(i / dateStep))
		})
	})
}

export const createAuthors = (n: number, dateStep = 1, useSequentialIds = true): Author[] => {
	return range(0, n <= 10 ** 12 ? n : 10 ** 12).map((i) => {
		const id = useSequentialIds ? `00000000-0000-0000-0000-${String(i).padStart(12, '0')}` : randomUUID()
		return new Author({
			id,
			name: `user-${id.slice(-12)}`,
			createdAt: addSeconds(startingDate, Math.trunc(i / dateStep)),
			age: i % 100,
			gender: getGender(i)
		})
	})
}

export const createDateContainers = (n: number, dateStep = 1): DateContainer[] => {
	return range(0, n <= 10 ** 6 ? n : 10 ** 6).map((i) => {
		return new DateContainer({
			id: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
			a: addSeconds(startingDate, Math.floor(i / dateStep)),
			b: i % 2 === 0 ? null : addSeconds(startingDate, Math.floor(i / dateStep))
		})
	})
}
