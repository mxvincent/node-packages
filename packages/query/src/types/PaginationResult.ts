import { PaginationCursors } from './PaginationCursors'
import { PaginationMetadata } from './PaginationMetadata'

export type PaginationResult<T> = PaginationCursors & PaginationMetadata & { data: T[] }

export type AsyncPaginationResult<T> = Promise<PaginationResult<T>>
