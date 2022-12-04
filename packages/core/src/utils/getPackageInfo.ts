import * as process from 'process'
import { readJsonFileSync } from '../fs/readJsonFileSync'

export interface PackageInfo {
	name: string
	version: string
	description?: string
}

export type GetPackageInfoOptions = {
	packageJsonFilePath: string
	defaultValues?: Partial<PackageInfo>
}

export const getPackageInfo = async (options: GetPackageInfoOptions): Promise<PackageInfo> => {
	const packageJson = await readJsonFileSync(options.packageJsonFilePath)
	const name = process.env.APP_NAME ?? packageJson.name ?? options.defaultValues?.name ?? 'unknown'
	const version = process.env.APP_VERSION ?? packageJson.version ?? options.defaultValues?.version ?? 'unknown'
	const description = packageJson.description ?? options.defaultValues?.description
	return { name, version, description }
}
