import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Episode } from "@ishiro/libs/database/entities";
import { EpisodeService } from "@ishiro/libs/shared/services";

import AnimeModule from "../animes/anime.module";
import { EpisodeResolver } from "./episode.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), forwardRef(() => AnimeModule)],
  providers: [EpisodeService, EpisodeResolver],
  exports: [EpisodeService],
})
export default class EpisodeModule {}
