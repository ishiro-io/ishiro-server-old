import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@ishiro/libs/database/entities";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import GoogleAuthModule from "./google/google-auth.module";
import PhoneAuthModule from "./phone/phone-auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PhoneAuthModule,
    GoogleAuthModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
