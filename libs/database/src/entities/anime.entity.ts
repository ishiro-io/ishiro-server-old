import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { AnimeStatus, AnimeType } from "../enums";
import BaseEntity from "./BaseEntity";
import { Category, Episode } from ".";

registerEnumType(AnimeType, {
  name: "AnimeType",
});

registerEnumType(AnimeStatus, {
  name: "AnimeStatus",
});

@Entity()
@ObjectType()
export default class Anime extends BaseEntity {
  @Field()
  @Column({ unique: true, nullable: true })
  idMAL?: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleEnglish?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleJapanese?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerImage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ type: "float", nullable: true })
  MALRating?: number;

  @Field(() => AnimeType)
  @Column({ type: "enum", enum: AnimeType })
  type: AnimeType;

  @Field(() => AnimeStatus)
  @Column({ type: "enum", enum: AnimeStatus, default: AnimeStatus.ONGOING })
  status: AnimeStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  releaseDate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  editor?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  duration?: string;

  @Field()
  @Column()
  isAdult: boolean;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.animes)
  @JoinTable()
  categories: Category[];

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.anime)
  episodes: Episode[];
}
