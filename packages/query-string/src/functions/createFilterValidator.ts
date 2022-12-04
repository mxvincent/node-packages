import { validateFilter } from './validateFilter'

/**
 * Get filter validation function
 * @throws {QueryStringValidationError}
 */
export const createFilterValidator = (filterable: string[]) => validateFilter(filterable)
