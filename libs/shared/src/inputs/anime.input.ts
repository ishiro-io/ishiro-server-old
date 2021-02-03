import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

import { AnimeStatus, AnimeType } from "@ishiro/libs/shared/enums";

@InputType()
export class CreateAnimeInput {
  @Field({ nullable: true })
  idMAL?: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  titleEnglish?: string;

  @Field({ nullable: true })
  titleJapanese?: string;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  MALRating?: number;

  @Field(() => AnimeType)
  type: AnimeType;

  @Field(() => AnimeStatus)
  status: AnimeStatus;

  @Field({ nullable: true })
  releaseDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  editor?: string;

  @Field({ nullable: true })
  duration?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isAdult = false;

  @Field(() => [Number], { nullable: true })
  categoriesIds?: number[];
}

@InputType()
export class UpdateAnimeInput {
  @Field({ nullable: true })
  idMAL?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  titleEnglish?: string;

  @Field({ nullable: true })
  titleJapanese?: string;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  MALRating?: number;

  @Field(() => AnimeType, { nullable: true })
  type?: AnimeType;

  @Field(() => AnimeStatus, { nullable: true })
  status?: AnimeStatus;

  @Field({ nullable: true })
  releaseDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  editor?: string;

  @Field({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  isAdult?: boolean;
}

@InputType()
export class SearchAnimesInput {
  @Field()
  @MinLength(3)
  textSearchField: string;
}
