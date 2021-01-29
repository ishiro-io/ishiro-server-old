import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PublicModule } from '@api/public/public.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PublicModule,
  ],
})
export class AppModule {}
