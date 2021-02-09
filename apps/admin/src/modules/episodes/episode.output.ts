import { Field, ObjectType } from "@nestjs/graphql";

import { Episode } from "@ishiro/libs/database/entities";

@ObjectType()
export class PopulatedEpisodesOutput {
  @Field()
  timeToPopulate: string;

  @Field(() => [Episode])
  fields: Episode[];
}
