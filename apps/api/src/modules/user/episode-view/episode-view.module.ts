import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEpisodeView } from "@ishiro/libs/database/entities";

import EpisodeModule from "../../episodes/episode.module";
import AnimeViewModule from "../anime-view/anime-view.module";
import UserModule from "../user.module";
import { EpisodeViewResolver } from "./episode-view.resolver";
import { EpisodeViewService } from "./episode-view.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEpisodeView]),
    forwardRef(() => AnimeViewModule),
    forwardRef(() => EpisodeModule),
    forwardRef(() => UserModule),
  ],
  providers: [EpisodeViewService, EpisodeViewResolver],
  exports: [EpisodeViewService],
})
class EpisodeViewModule {}

export default EpisodeViewModule;
