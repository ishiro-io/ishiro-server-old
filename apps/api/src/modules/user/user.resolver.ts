import { Inject, UseGuards, forwardRef } from "@nestjs/common";
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { AuthGuard } from "@ishiro/api/guard/auth.guard";
import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { EpisodeViewService } from "./episode-view/episode-view.service";
import { UpdateUsernameInput } from "./user.input";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => EpisodeViewService))
    private readonly episodeViewService: EpisodeViewService
  ) {}

  @Mutation(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async updateUsername(
    @Args("input")
    { username }: UpdateUsernameInput,
    @CurrentUser() user: User,
    @Context() ctx: IshiroContext
  ): Promise<User> {
    const newUser = await this.userService.updateUsername(user.id, username);

    ctx.req.session.user = newUser;

    return newUser;
  }

  @ResolveField(() => Number, { name: "totalSeenTime", nullable: true })
  getTotalSeenTime(@Parent() user: User): Promise<number> {
    return this.episodeViewService.getTotalSeenTime(user);
  }

  @ResolveField(() => Number, { name: "animeSeenCount" })
  getAnimeSeenCount(@Parent() user: User): Promise<number> {
    return this.userService.getAnimeSeenCount(user);
  }

  @ResolveField(() => Number, { name: "episodeSeenCount" })
  getEpisodeSeenCount(@Parent() user: User): Promise<number> {
    return this.episodeViewService.getEpisodeSeenCount(user);
  }
}
