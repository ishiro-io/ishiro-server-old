import { Field, ObjectType } from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";

import { PaginatedOutput } from "./paginated.output";

@ObjectType()
export class AnimesOutput extends PaginatedOutput(Anime) {}

@ObjectType()
export default class Arc {
  @Field({ nullable: true })
  title?: string;

  @Field()
  firstEpisodeNumber: number;

  @Field()
  lastEpisodeNumber: number;
}
