import { randomUUID } from 'crypto'
import { range } from 'ramda'
import { hydrate } from '../../helpers/hydrate'
import { Author, DateContainer, Gender } from './entities'


const startingDate = new Date('2020-01-01T00:00:00Z')
const addSeconds = (date: Date, n: number): Date => new Date(date.getTime() + n * 1000)

export const getGender = (n: number): Gender => ['female', 'male', 'unknown'][n % 3] as Gender

export const createAuthor = (options: Partial<Author> = {}): Author => {
	const id = options.id ?? randomUUID()
	return hydrate(Author, {
		id,
		name: options.name ?? `author-${id.slice(-12)}`,
		createdAt: options.createdAt ?? new Date(),
		age: options.age ?? Math.floor(Math.random() * 100),
		gender: options.gender ?? getGender(Math.floor(Math.random() * 100))
	})
}
export const createAuthors = (n: number, dateStep = 1, useSequentialIds = true): Author[] => {
	return range(0, n <= 10 ** 12 ? n : 10 ** 12).map((i) => {
		const id = useSequentialIds ? `00000000-0000-0000-0000-${String(i).padStart(12, '0')}` : randomUUID()
		return createAuthor({
			id,
			name: `author-${id.slice(-12)}`,
			createdAt: addSeconds(startingDate, Math.trunc(i / dateStep)),
			age: i % 100,
			gender: getGender(i)
		})
	})
}

export const createDateContainers = (n: number, dateStep = 1): DateContainer[] => {
	return range(0, n <= 10 ** 6 ? n : 10 ** 6).map((i) => {
		return hydrate(DateContainer, {
			id: `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
			a: addSeconds(startingDate, Math.floor(i / dateStep)),
			b: i % 2 === 0 ? null : addSeconds(startingDate, Math.floor(i / dateStep))
		})
	})
}

export const factories = { createAuthor, createAuthors, createDateContainers }
