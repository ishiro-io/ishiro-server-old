import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

import BaseEntity from "./base-entity";
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

  @Field({ defaultValue: false })
  @Column()
  isFiller: boolean;

  @Field({ defaultValue: false })
  @Column()
  isRecap: boolean;

  @Field(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.episodes)
  anime: Anime;
}
