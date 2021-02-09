import { Field, ObjectType } from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";

@ObjectType()
export class PopulatedAnimesOutput {
  @Field()
  timeToPopulate: string;

  @Field(() => [Anime])
  fields: Anime[];
}
