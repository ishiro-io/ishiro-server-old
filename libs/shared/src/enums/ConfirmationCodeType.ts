import { registerEnumType } from "@nestjs/graphql";

export enum ConfirmationCodeType {
  PHONE_NUMBER = "PHONE_NUMBER",
  PASSWORD = "PASSWORD",
}

registerEnumType(ConfirmationCodeType, {
  name: "ConfirmationCodeType",
});
