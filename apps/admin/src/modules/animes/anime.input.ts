import { Field, InputType } from "@nestjs/graphql";

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
