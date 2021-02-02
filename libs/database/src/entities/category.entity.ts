import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany } from "typeorm";

import BaseEntity from "./base-entity";
import { Anime } from ".";

@Entity()
@ObjectType()
export default class Category extends BaseEntity {
  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImage?: string;

  @Field(() => [Anime])
  @ManyToMany(() => Anime, (anime) => anime.categories)
  animes: Anime[];
}
