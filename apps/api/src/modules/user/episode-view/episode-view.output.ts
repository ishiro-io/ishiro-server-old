import { Field, ObjectType } from "@nestjs/graphql";

import { Episode, UserEpisodeView } from "@ishiro/libs/database/entities";

@ObjectType()
export default class EpisodeWithStatus {
  @Field(() => Episode)
  episode: Episode;

  @Field(() => UserEpisodeView, { nullable: true })
  view?: UserEpisodeView;
}
