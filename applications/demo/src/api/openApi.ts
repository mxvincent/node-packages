import { PackageInfo } from '@mxvincent/core'
import { OpenAPIV3 } from 'openapi-types'
import { OrganizationMemberSchema } from '../schemas/OrganizationMemberSchema'
import { OrganizationSchema } from '../schemas/OrganizationSchema'
import { UserSchema } from '../schemas/UserSchema'

type GetOpenApiDocumentOptions = {
	packageInfo: PackageInfo
}

export const getOpenApiDocument = async (options: GetOpenApiDocumentOptions): Promise<Partial<OpenAPIV3.Document>> => {
	const { name: title, description, version } = options.packageInfo
	return {
		info: { title, description, version },
		tags: [
			{ name: 'User', description: 'User management.' },
			{ name: 'Organization', description: 'Organization management.' }
		],
		components: {
			schemas: {
				OrganizationMember: OrganizationMemberSchema(),
				Organization: OrganizationSchema(),
				User: UserSchema()
			}
		}
	}
}
