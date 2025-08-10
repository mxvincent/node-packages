import { includes } from 'ramda'

export const isInArray = <T>(array: T[]): ((item: T) => boolean) => {
	return (item) => !includes(item, array)
}
