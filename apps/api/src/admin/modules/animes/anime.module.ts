import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Anime } from "@ishiro/libs/database/entities";
import { AnimeService } from "@ishiro/libs/shared/services";
import { ExternalAPIService } from "@ishiro/libs/shared/services/external-api.service";

import { CategoryModule } from "../categories/category.module";
import { EpisodeModule } from "../episodes/episode.module";
import { AnimeResolver } from "./anime.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
    forwardRef(() => CategoryModule),
    forwardRef(() => EpisodeModule),
  ],
  providers: [AnimeService, ExternalAPIService, AnimeResolver],
  exports: [AnimeService],
})
export class AnimeModule {}
