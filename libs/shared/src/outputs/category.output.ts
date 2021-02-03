import { Field, ObjectType } from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";

@ObjectType()
export default class CategoryPreview {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [Anime])
  animes: Anime[];
}
