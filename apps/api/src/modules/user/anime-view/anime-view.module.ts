import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EpisodeModule } from "@ishiro/admin/modules/episodes/episode.module";
import { UserAnimeView } from "@ishiro/libs/database/entities";

import AnimeModule from "../../animes/anime.module";
import UserModule from "../user.module";
import { AnimeViewResolver } from "./anime-view.resolver";
import { AnimeViewService } from "./anime-view.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAnimeView]),
    forwardRef(() => AnimeModule),
    forwardRef(() => EpisodeModule),
    forwardRef(() => UserModule),
  ],
  providers: [AnimeViewService, AnimeViewResolver],
  exports: [AnimeViewService],
})
class AnimeViewModule {}

export default AnimeViewModule;
