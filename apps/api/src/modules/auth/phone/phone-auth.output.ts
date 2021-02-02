import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "@ishiro/libs/database/entities";

@ObjectType()
export class ConnectOutput {
  @Field({ nullable: true })
  user?: User;
}
