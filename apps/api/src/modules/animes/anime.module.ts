import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { AnimeService } from "@ishiro/libs/shared/services";

import CategoryModule from "../categories/category.module";
import EpisodeModule from "../episodes/episode.module";
import { AnimeResolver } from "./anime.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
    forwardRef(() => CategoryModule),
    forwardRef(() => EpisodeModule),
  ],
  providers: [AnimeService, AnimeResolver, ExternalApiService],
  exports: [AnimeService],
})
export default class AnimeModule {}
