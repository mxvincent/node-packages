import { TableColumnOptions } from 'typeorm'

export const timestampzTableColumn = (options: Omit<TableColumnOptions, 'type' | 'precision'>): TableColumnOptions => {
	return { ...options, type: 'timestamp with time zone', precision: 3 }
}
