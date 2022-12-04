import fs from 'fs'
import { resolve } from 'path'
import { getLogger } from '../logger'
import { isReadableFileSync } from './isReadableFileSync'

/**
 * Get file content as string synchronously
 */
export const readJsonFileSync = (path: string): any => {
	const fullPath = resolve(path)
	const logger = getLogger()
	if (!isReadableFileSync(fullPath)) {
		logger.error(`[fs] json file is not readable (path=${fullPath})`)
		return {}
	}
	try {
		return JSON.parse(fs.readFileSync(fullPath).toString('utf-8'))
	} catch (error) {
		logger.error({ error }, `[fs] failed to read json file (path=${fullPath})`)
		return {}
	}
}
