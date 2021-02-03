import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { GoogleConnectInput, GoogleRegisterInput } from "./google-auth.input";
import { GoogleConnectOutput } from "./google-auth.output";
import { GoogleAuthService } from "./google-auth.service";

@Resolver(() => User)
export class GoogleAuthResolver {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Mutation(() => GoogleConnectOutput, {
    name: "googleConnect",
    nullable: true,
  })
  async connect(
    @Args("input")
    input: GoogleConnectInput,
    @Context() ctx: IshiroContext
  ): Promise<GoogleConnectOutput> {
    return this.googleAuthService.connect(input, ctx);
  }

  @Mutation(() => User, { name: "googleRegister" })
  async register(
    @Args("input") input: GoogleRegisterInput,
    @Context() ctx: IshiroContext
  ): Promise<User> {
    return this.googleAuthService.register(input, ctx);
  }
}
