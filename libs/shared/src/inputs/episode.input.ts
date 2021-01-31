import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateEpisodeInput {
  @Field(() => Int)
  animeId: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  number: number;

  @Field({ nullable: true })
  arcName?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true })
  airedDate?: string;
}

@InputType()
export class UpdateEpisodeInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  number?: number;

  @Field({ nullable: true })
  arcName?: string;

  @Field({ nullable: true })
  airedDate?: string;
}
