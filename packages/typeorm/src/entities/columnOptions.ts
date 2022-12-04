import { ColumnOptions } from 'typeorm'

export const timestampzOptions = (options?: Omit<ColumnOptions, 'type'>): ColumnOptions => {
	return { ...options, type: 'timestamp with time zone', precision: options?.precision ?? 3 }
}
