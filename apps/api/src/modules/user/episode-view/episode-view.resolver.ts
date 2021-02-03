import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { User, UserEpisodeView } from "@ishiro/libs/database/entities";

import { SetUserAnimeEpisodesStatusInput } from "./episode-view.input";
import EpisodeWithStatus from "./episode-view.output";
import { EpisodeViewService } from "./episode-view.service";

@Resolver(() => UserEpisodeView)
export class EpisodeViewResolver {
  constructor(private readonly episodeViewService: EpisodeViewService) {}

  @Query(() => [EpisodeWithStatus], {
    name: "userAnimeEpisodesStatus",
    nullable: true,
  })
  async getAnimeEpisodesStatus(
    @Args("animeId") animeId: number,
    @CurrentUser() user: User
  ): Promise<EpisodeWithStatus[]> {
    return this.episodeViewService.getAnimeEpisodesStatus(user, animeId);
  }

  @Mutation(() => [UserEpisodeView], { nullable: true })
  async setUserAnimeEpisodesStatus(
    @Args("input")
    input: SetUserAnimeEpisodesStatusInput,
    @CurrentUser() user: User
  ): Promise<UserEpisodeView[]> {
    return this.episodeViewService.setAnimeEpisodesStatus(user, input);
  }
}
