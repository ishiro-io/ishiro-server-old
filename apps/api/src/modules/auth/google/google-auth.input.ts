import { Field, InputType } from "@nestjs/graphql";

import { IS_USERNAME_ALREADY_EXIST_ERROR } from "@ishiro/api/constants/errorMessages";
import { IsUsernameAlreadyExist } from "@ishiro/api/validators";

@InputType()
export class GoogleConnectInput {
  @Field()
  accountId: string;
}

@InputType()
export class GoogleRegisterInput {
  @Field()
  accountId: string;

  @Field()
  @IsUsernameAlreadyExist({ message: IS_USERNAME_ALREADY_EXIST_ERROR })
  username: string;
}
