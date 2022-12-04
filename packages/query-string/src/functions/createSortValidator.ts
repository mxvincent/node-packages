import { validateSort } from './validateSort'

/**
 * Get sort validation function
 * @throws {QueryStringValidationError}
 */
export const createSortValidator = (sortable: string[]) => validateSort(sortable)
