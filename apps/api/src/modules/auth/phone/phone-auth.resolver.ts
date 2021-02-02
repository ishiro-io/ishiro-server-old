import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import {
  AskConfirmationCodeInput,
  ConnectInput,
  RegisterInput,
} from "./phone-auth.input";
import { ConnectOutput } from "./phone-auth.output";
import { PhoneAuthService } from "./phone-auth.service";

@Resolver(() => User)
export class PhoneAuthResolver {
  constructor(private readonly phoneAuthService: PhoneAuthService) {}

  @Mutation(() => Boolean)
  async askConfirmationCode(
    @Args("input")
    { phoneNumber }: AskConfirmationCodeInput
  ): Promise<boolean> {
    return this.phoneAuthService.askConfirmationCode(phoneNumber);
  }

  @Mutation(() => ConnectOutput, { nullable: true })
  async connect(
    @Args("input")
    input: ConnectInput,
    @Context() ctx: IshiroContext
  ): Promise<ConnectOutput | null> {
    return this.phoneAuthService.connect(input, ctx);
  }

  @Mutation(() => User)
  async register(
    @Args("input") input: RegisterInput,
    @Context() ctx: IshiroContext
  ): Promise<User> {
    return this.phoneAuthService.register(input, ctx);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: IshiroContext): Promise<boolean> {
    return this.phoneAuthService.logout(ctx);
  }
}
