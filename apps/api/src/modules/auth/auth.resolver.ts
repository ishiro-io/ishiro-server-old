import { Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@ishiro/api/decorators";
import { User } from "@ishiro/libs/database/entities";

@Resolver(() => User)
export class AuthResolver {
  @Query(() => User, { name: "me", nullable: true })
  async me(@CurrentUser() user: User): Promise<User | undefined> {
    return user;
  }
}
