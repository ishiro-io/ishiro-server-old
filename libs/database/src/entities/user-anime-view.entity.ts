import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany, Unique } from "typeorm";

import { AnimeViewStatus } from "@ishiro/libs/shared/enums";

import BaseEntity from "./base-entity";
import { Anime, User, UserEpisodeView } from ".";

@Unique(["anime", "user"])
@Entity()
@ObjectType()
export default class UserAnimeView extends BaseEntity {
  @Field(() => AnimeViewStatus)
  @Column({ type: "enum", enum: AnimeViewStatus })
  status: AnimeViewStatus;

  @Field(() => Anime)
  @ManyToOne(() => Anime)
  anime: Anime;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => [UserEpisodeView])
  @OneToMany(() => UserEpisodeView, (episodeViews) => episodeViews.animeView)
  episodeViews: UserEpisodeView[];
}
