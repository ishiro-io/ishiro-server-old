import { Field, InputType } from "@nestjs/graphql";
import { Length } from "class-validator";

import { IS_USERNAME_ALREADY_EXIST_ERROR } from "@ishiro/api/constants/errorMessages";
import { IsUsernameAlreadyExist } from "@ishiro/api/validators";

@InputType()
export class UpdateUsernameInput {
  @Field()
  @Length(1, 30)
  @IsUsernameAlreadyExist({ message: IS_USERNAME_ALREADY_EXIST_ERROR })
  username: string;
}
