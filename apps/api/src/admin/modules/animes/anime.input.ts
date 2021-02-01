import { Field, InputType, ObjectType } from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";

@InputType()
export class PopulateAnimesInput {
  @Field()
  animeAmount: number;

  @Field({ nullable: true, defaultValue: 0 })
  offset: number;

  @Field({ nullable: true, defaultValue: true })
  doPopulateEpisodes: boolean;

  @Field({ nullable: true, defaultValue: true })
  doTranslateDescription: boolean;
}

@ObjectType()
export class PopulatedAnimesOutput {
  @Field()
  timeToPopulate: string;

  @Field(() => [Anime])
  fields: Anime[];
}
