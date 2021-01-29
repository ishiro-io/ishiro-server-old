import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Anime, Category, Episode } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: false,
      cache: true,
      entities: [Anime, Category, Episode],
      autoLoadEntities: true,
      keepConnectionAlive: true,
    }),
  ],
})
export class DatabaseModule {}
