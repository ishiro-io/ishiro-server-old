import { Module, forwardRef } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { AnimeService } from "@ishiro/libs/shared/services";

import { CategoryModule } from "../categories/category.module";
import { EpisodeModule } from "../episodes/episode.module";
import { AnimeResolver } from "./anime.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
    ScheduleModule.forRoot(),
    forwardRef(() => CategoryModule),
    forwardRef(() => EpisodeModule),
  ],
  providers: [AnimeService, ExternalApiService, AnimeResolver],
  exports: [AnimeService],
})
export class AnimeModule {}
