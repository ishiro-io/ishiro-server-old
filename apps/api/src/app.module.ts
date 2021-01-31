import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "@ishiro/libs/database/database.module";

import { AdminModule } from "./admin/admin.module";
import { PublicModule } from "./public/public.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PublicModule,
    AdminModule,
  ],
})
export class AppModule {}
