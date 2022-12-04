// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { HttpError } from './errors'

export const isHttpError = (value: any): value is HttpError => {
	return typeof value === 'object' && value?.code && value?.statusCode && value?.message
}
