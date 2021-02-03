import { Context, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { AuthService } from "./auth.service";

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User, { name: "me", nullable: true })
  async me(@CurrentUser() user: User): Promise<User | undefined> {
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: IshiroContext): Promise<boolean> {
    return this.authService.logout(ctx);
  }
}
