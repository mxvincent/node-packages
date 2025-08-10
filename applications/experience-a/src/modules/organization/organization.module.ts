import { DatabaseModule } from '#/database/database.module'
import { UserModule } from '#/modules/user/user.module'
import { forwardRef, Module } from '@nestjs/common'
import { OrganizationMemberResolver } from './organization-member.resolver'
import { OrganizationResolver } from './organization.resolver'
import { OrganizationService } from './organization.service'

@Module({
	imports: [DatabaseModule, forwardRef(() => UserModule)],
	providers: [OrganizationResolver, OrganizationService, OrganizationMemberResolver],
	exports: [OrganizationService]
})
export class OrganizationModule {}
