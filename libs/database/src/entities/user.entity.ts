import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import BaseEntity from "./base-entity";

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @Field()
  @Column({ unique: true })
  username: string;
}
