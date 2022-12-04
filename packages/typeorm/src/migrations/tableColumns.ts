import { TableColumnOptions } from 'typeorm'
import { defaultDate, defaultUuid } from './defaultValues'
import { timestampzTableColumn } from './tableColumnOptions'

export const idColumn: TableColumnOptions = {
	name: 'id',
	type: 'uuid',
	isPrimary: true,
	default: defaultUuid
}

export const createdAtColumn = timestampzTableColumn({
	name: 'createdAt',
	default: defaultDate
})

export const updatedAtColumn = timestampzTableColumn({
	name: 'updatedAt',
	default: defaultDate
})

export const deletedAtColumn = timestampzTableColumn({
	name: 'deletedAt',
	isNullable: true
})

/**
 * Create table columns definition array for a resource
 */
export const resource = (columns: TableColumnOptions[]): TableColumnOptions[] => {
	return [idColumn, createdAtColumn, updatedAtColumn]
		.filter((resourceCol) => !columns.some((argCol) => argCol.name === resourceCol.name))
		.concat(columns)
}

/**
 * Create table columns definition array for a resource with soft delete support
 */
export const softDeletableResource = (columns: TableColumnOptions[]): TableColumnOptions[] => {
	return resource([...columns, deletedAtColumn])
}
