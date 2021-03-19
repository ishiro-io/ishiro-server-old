import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { AnimeType } from "@ishiro/libs/shared/enums";

import BaseEntity from "./base-entity";
import { Category, Episode } from ".";

@Entity()
@ObjectType()
export default class Anime extends BaseEntity {
  @Field()
  @Column({ unique: true, nullable: true })
  idAniDB?: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleFrench?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleEnglish?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleRomaji?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  titleKanji?: string;

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
  aniDBRating?: number;

  @Field(() => AnimeType)
  @Column({ type: "enum", enum: AnimeType })
  type: AnimeType;

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
  isAdult: boolean;

  @Field(() => [Category])
  @ManyToMany(() => Category, (category) => category.animes)
  @JoinTable()
  categories: Category[];

  @Field(() => [Episode])
  @OneToMany(() => Episode, (episode) => episode.anime)
  episodes: Episode[];
}
