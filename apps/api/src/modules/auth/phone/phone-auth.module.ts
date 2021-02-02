import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User, UserPhoneAuth } from "@ishiro/libs/database/entities";

import { PhoneAuthResolver } from "./phone-auth.resolver";
import { PhoneAuthService } from "./phone-auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPhoneAuth])],
  providers: [PhoneAuthService, PhoneAuthResolver],
  exports: [PhoneAuthService],
})
class PhoneAuthModule {}

export default PhoneAuthModule;
