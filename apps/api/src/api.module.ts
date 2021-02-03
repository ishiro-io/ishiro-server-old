import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { DatabaseModule } from "@ishiro/libs/database/database.module";

import AnimeModule from "./modules/animes/anime.module";
import AuthModule from "./modules/auth/auth.module";
import CategoryModule from "./modules/categories/category.module";
import EpisodeModule from "./modules/episodes/episode.module";
import UserModule from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AnimeModule,
    CategoryModule,
    EpisodeModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}
