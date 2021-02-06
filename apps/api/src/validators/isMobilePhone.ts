import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMobilePhone,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint()
export class IsMobilePhoneConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    return (
      phoneNumber === process.env.DEMO_PHONE_NUMBER ||
      isMobilePhone(phoneNumber, "fr-FR")
    );
  }
}

export const IsMobilePhone = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMobilePhoneConstraint,
    });
  };
};
