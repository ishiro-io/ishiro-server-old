import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { AuthGuard } from "@ishiro/api/guard/auth.guard";
import { Episode, User, UserAnimeView } from "@ishiro/libs/database/entities";
import { AnimeViewStatus } from "@ishiro/libs/shared/enums";
import { PaginationInput } from "@ishiro/libs/shared/inputs";

import { UserAnimeViewsByStatusOutput } from "./anime-view.output";
import { AnimeViewService } from "./anime-view.service";

@Resolver(() => UserAnimeView)
export class AnimeViewResolver {
  constructor(private readonly animeViewService: AnimeViewService) {}

  @Query(() => UserAnimeViewsByStatusOutput, { nullable: true })
  @UseGuards(AuthGuard)
  async userAnimeViewsByStatus(
    @Args("options", { defaultValue: { limit: 20, offset: 0 } })
    options: PaginationInput,
    @Args("status", { type: () => AnimeViewStatus }) status: AnimeViewStatus,
    @CurrentUser() user: User
  ): Promise<UserAnimeViewsByStatusOutput> {
    return this.animeViewService.getByStatus(user, status, options);
  }

  @Query(() => UserAnimeView, { nullable: true })
  @UseGuards(AuthGuard)
  async userAnimeView(
    @Args("animeId") animeId: number,
    @CurrentUser() user: User
  ): Promise<UserAnimeView> {
    return this.animeViewService.getByAnimeId(user, animeId);
  }

  @Mutation(() => UserAnimeView, { nullable: true })
  @UseGuards(AuthGuard)
  async setUserAnimeViewStatus(
    @Args("animeId") animeId: number,
    @Args("status", { type: () => AnimeViewStatus }) status: AnimeViewStatus,
    @CurrentUser() user: User
  ): Promise<UserAnimeView> {
    return this.animeViewService.setStatus(user, animeId, status);
  }

  @ResolveField(() => Episode, { name: "lastEpisodeSeen", nullable: true })
  getLastEpisodeSeen(@Parent() userAnimeView: UserAnimeView): Promise<Episode> {
    return this.animeViewService.getLastEpisodeSeen(userAnimeView);
  }

  @ResolveField(() => Episode, { name: "nextEpisodeToSee", nullable: true })
  getNextEpisodeToSee(
    @Parent() userAnimeView: UserAnimeView
  ): Promise<Episode> {
    return this.animeViewService.getNextEpisodeToSee(userAnimeView);
  }
}
