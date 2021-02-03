import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SetUserAnimeEpisodesStatusInput {
  @Field()
  animeId: number;

  @Field(() => [NewEpisodeView])
  newEpisodeViews: NewEpisodeView[];
}

@InputType()
export class NewEpisodeView {
  @Field()
  episodeNumber: number;

  @Field()
  toSeen: boolean;
}
