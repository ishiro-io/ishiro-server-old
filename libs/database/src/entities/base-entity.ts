import { Field, ObjectType } from "@nestjs/graphql";
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TOBaseEntity,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
export default class BaseEntity extends TOBaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: string;
}
