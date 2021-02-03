import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

import BaseEntity from "./base-entity";
import { Episode, UserAnimeView } from ".";

@Unique(["episode", "animeView"])
@Entity()
@ObjectType()
export default class UserEpisodeView extends BaseEntity {
  @Field({ nullable: true })
  @Column({ type: "bool", default: false, nullable: true })
  hasBeenSeen?: boolean;

  @Field(() => Episode)
  @ManyToOne(() => Episode)
  episode: Episode;

  @Field(() => UserAnimeView)
  @ManyToOne(() => UserAnimeView, (animeView) => animeView.episodeViews)
  animeView: UserAnimeView;
}
