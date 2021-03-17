import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

import { AnimeType } from "@ishiro/libs/shared/enums";

@InputType()
export class CreateAnimeInput {
  @Field({ nullable: true })
  idAniDB?: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  titleFrench: string;

  @Field({ nullable: true })
  titleEnglish: string;

  @Field({ nullable: true })
  titleRomaji?: string;

  @Field({ nullable: true })
  titleKanji?: string;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  aniDBRating?: number;

  @Field(() => AnimeType)
  type: AnimeType;

  @Field({ nullable: true })
  releaseDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  editor?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isAdult? = false;

  @Field(() => [Number], { nullable: true })
  categoriesIds?: number[];
}

@InputType()
export class UpdateAnimeInput {
  @Field({ nullable: true })
  idAniDB?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  titleFrench: string;

  @Field({ nullable: true })
  titleEnglish: string;

  @Field({ nullable: true })
  titleRomaji?: string;

  @Field({ nullable: true })
  titleKanji?: string;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  aniDBRating?: number;

  @Field(() => AnimeType, { nullable: true })
  type?: AnimeType;

  @Field({ nullable: true })
  releaseDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  editor?: string;

  @Field({ nullable: true })
  isAdult?: boolean;
}

@InputType()
export class SearchAnimesInput {
  @Field()
  @MinLength(3)
  textSearchField: string;
}
