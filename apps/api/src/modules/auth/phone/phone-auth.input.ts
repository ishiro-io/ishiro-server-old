import { Field, InputType } from "@nestjs/graphql";
import { IsMobilePhone } from "class-validator";

import { IS_USERNAME_ALREADY_EXIST_ERROR } from "@ishiro/api/constants/errorMessages";
import { IsUsernameAlreadyExist } from "@ishiro/api/validators";

@InputType()
export class PhoneAskConfirmationCodeInput {
  @Field()
  @IsMobilePhone("fr-FR")
  phoneNumber: string;
}

@InputType()
export class PhoneConnectInput {
  @Field()
  @IsMobilePhone("fr-FR")
  phoneNumber: string;

  @Field()
  code: string;
}

@InputType()
export class PhoneRegisterInput {
  @Field()
  @IsMobilePhone("fr-FR")
  phoneNumber: string;

  @Field()
  @IsUsernameAlreadyExist({ message: IS_USERNAME_ALREADY_EXIST_ERROR })
  username: string;

  @Field()
  code: string;
}
