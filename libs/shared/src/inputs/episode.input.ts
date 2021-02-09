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
  airedDate?: string;

  @Field({ nullable: true })
  length?: number;

  @Field({ defaultValue: false })
  isFiller?: boolean;

  @Field({ defaultValue: false })
  isRecap?: boolean;
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

  @Field({ nullable: true })
  length?: number;

  @Field({ nullable: true })
  isFiller?: boolean;

  @Field({ nullable: true })
  isRecap?: boolean;
}
