import { join } from 'node:path'

export interface CommandOptions {
	rootDir?: string
}

export const node = (main: string, options: CommandOptions = {}) => {
	options.rootDir ??= '/app/dist'
	return ['/nodejs/bin/node', join(options.rootDir, main)]
}
