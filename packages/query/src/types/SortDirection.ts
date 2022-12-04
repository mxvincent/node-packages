export const sortDirections = ['asc', 'desc'] as const
export type SortDirection = typeof sortDirections[number]
