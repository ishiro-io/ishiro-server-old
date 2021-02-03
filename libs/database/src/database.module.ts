import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  Anime,
  Category,
  Episode,
  User,
  UserAnimeView,
  UserEpisodeView,
  UserGoogleAuth,
  UserPhoneAuth,
} from "./entities";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== "production",
      logging: false,
      cache: true,
      entities: [
        Anime,
        Category,
        Episode,
        User,
        UserAnimeView,
        UserEpisodeView,
        UserGoogleAuth,
        UserPhoneAuth,
      ],
      autoLoadEntities: true,
      keepConnectionAlive: true,
    }),
  ],
})
export class DatabaseModule {}
