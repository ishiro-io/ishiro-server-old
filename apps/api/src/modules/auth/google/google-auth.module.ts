import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User, UserGoogleAuth } from "@ishiro/libs/database/entities";

import { GoogleAuthResolver } from "./google-auth.resolver";
import { GoogleAuthService } from "./google-auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGoogleAuth])],
  providers: [GoogleAuthService, GoogleAuthResolver],
  exports: [GoogleAuthService],
})
class GoogleAuthModule {}

export default GoogleAuthModule;
