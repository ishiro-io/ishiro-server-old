import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@ishiro/libs/database/entities";

import { AuthResolver } from "./auth.resolver";
import PhoneAuthModule from "./phone/phone-auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), PhoneAuthModule],
  providers: [AuthResolver],
})
class AuthModule {}

export default AuthModule;
