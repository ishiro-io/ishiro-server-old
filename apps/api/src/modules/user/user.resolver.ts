import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { AuthGuard } from "@ishiro/api/guard/auth.guard";
import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { UpdateUsernameInput } from "./user.input";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
}
