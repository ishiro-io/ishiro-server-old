import { Field, InputType } from "@nestjs/graphql";

import {
  INVALID_PHONE_NUMBER_ERROR,
  IS_USERNAME_ALREADY_EXIST_ERROR,
} from "@ishiro/api/constants/errorMessages";
import { IsUsernameAlreadyExist } from "@ishiro/api/validators";
import { IsMobilePhone } from "@ishiro/api/validators/isMobilePhone";

@InputType()
export class PhoneAskConfirmationCodeInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber: string;
}

@InputType()
export class PhoneConnectInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber: string;

  @Field()
  code: string;
}

@InputType()
export class PhoneRegisterInput {
  @Field()
  @IsMobilePhone({ message: INVALID_PHONE_NUMBER_ERROR })
  phoneNumber: string;

  @Field()
  @IsUsernameAlreadyExist({ message: IS_USERNAME_ALREADY_EXIST_ERROR })
  username: string;

  @Field()
  code: string;
}
