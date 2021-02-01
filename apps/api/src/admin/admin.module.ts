import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthGuard } from "./guard/auth.guard";
import { AnimeModule } from "./modules/animes/anime.module";
import { CategoryModule } from "./modules/categories/category.module";
import { EpisodeModule } from "./modules/episodes/episode.module";

@Module({
  imports: [
    AnimeModule,
    CategoryModule,
    EpisodeModule,
    GraphQLModule.forRoot({
      include: [AnimeModule, CategoryModule, EpisodeModule],
      autoSchemaFile: "admin-schema.gql",
      path: "admin",
      introspection: true,
      playground: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AdminModule {}
