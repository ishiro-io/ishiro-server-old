import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

import { User } from "@ishiro/libs/database/entities";

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(username: string) {
    return User.findOne({
      where: { username },
    }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export const IsUsernameAlreadyExist = (
  validationOptions?: ValidationOptions
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyExistConstraint,
    });
  };
};
