import { DatabaseModule } from '#/database/database.module'
import { OrganizationModule } from '#/modules/organization/organization.module'
import { forwardRef, Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
	imports: [DatabaseModule, forwardRef(() => OrganizationModule)],
	providers: [UserResolver, UserService],
	exports: [UserService]
})
export class UserModule {}
