import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

import BaseEntity from "./BaseEntity";
import { Anime } from ".";

@Unique(["number", "anime"])
@Entity()
@ObjectType()
export default class Episode extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field()
  @Column()
  number: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  arcName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  airedDate?: string;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.episodes)
  anime: Anime;
}
