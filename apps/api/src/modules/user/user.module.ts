import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "@ishiro/libs/database/entities";

import AnimeViewModule from "./anime-view/anime-view.module";
import EpisodeViewModule from "./episode-view/episode-view.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AnimeViewModule,
    EpisodeViewModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
class UserModule {}

export default UserModule;
