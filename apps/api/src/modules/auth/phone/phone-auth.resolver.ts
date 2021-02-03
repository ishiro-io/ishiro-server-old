import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";

import { User } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import {
  PhoneAskConfirmationCodeInput,
  PhoneConnectInput,
  PhoneRegisterInput,
} from "./phone-auth.input";
import { PhoneConnectOutput } from "./phone-auth.output";
import { PhoneAuthService } from "./phone-auth.service";

@Resolver(() => User)
export class PhoneAuthResolver {
  constructor(private readonly phoneAuthService: PhoneAuthService) {}

  @Mutation(() => Boolean, { name: "phoneAskConfirmationCode" })
  async askConfirmationCode(
    @Args("input")
    { phoneNumber }: PhoneAskConfirmationCodeInput
  ): Promise<boolean> {
    return this.phoneAuthService.askConfirmationCode(phoneNumber);
  }

  @Mutation(() => PhoneConnectOutput, { name: "phoneConnect", nullable: true })
  async connect(
    @Args("input")
    input: PhoneConnectInput,
    @Context() ctx: IshiroContext
  ): Promise<PhoneConnectOutput> {
    return this.phoneAuthService.connect(input, ctx);
  }

  @Mutation(() => User, { name: "phoneRegister" })
  async register(
    @Args("input") input: PhoneRegisterInput,
    @Context() ctx: IshiroContext
  ): Promise<User> {
    return this.phoneAuthService.register(input, ctx);
  }
}
